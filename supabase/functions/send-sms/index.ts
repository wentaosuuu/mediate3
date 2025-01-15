import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phoneNumbers, content } = await req.json()
    
    console.log('接收到短信请求:', { phoneNumbers, content })

    // 验证必要参数
    if (!phoneNumbers || !content) {
      throw new Error('手机号码和短信内容不能为空')
    }

    // API参数配置
    const account = Deno.env.get('SMS_ACCOUNT')
    const password = Deno.env.get('SMS_PASSWORD')
    const extno = "10690545612"

    // 将手机号码字符串转换为数组并去除空格
    const phoneNumberList = phoneNumbers.split(',').map(phone => phone.trim())
    console.log('处理后的手机号列表:', phoneNumberList)

    // 为每个手机号发送短信
    const results = await Promise.all(phoneNumberList.map(async (phone) => {
      const formData = new URLSearchParams()
      formData.append('action', 'send')
      formData.append('account', account)
      formData.append('password', password)
      formData.append('mobile', phone)
      formData.append('content', content)
      formData.append('extno', extno)
      formData.append('rt', 'json')

      try {
        const response = await fetch(Deno.env.get('SMS_API_URL'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        })

        const text = await response.text()
        console.log('API响应文本:', text)

        let result
        try {
          result = JSON.parse(text)
        } catch (e) {
          console.error('解析响应JSON失败:', e)
          throw new Error('解析响应失败')
        }

        console.log('短信API响应:', result)
        
        // 根据 API 响应判断是否发送成功
        const success = result.status === '0'
        return { 
          phone, 
          success,
          result,
          mid: result.list?.[0]?.mid, // 保存消息ID
          message: success ? '发送成功' : `发送失败: ${result.message || '未知错误'}`
        }
      } catch (error) {
        console.error('发送短信失败:', error)
        return { 
          phone, 
          success: false, 
          error: error.message,
          message: `发送失败: ${error.message}`
        }
      }
    }))

    // 统计发送结果
    const successCount = results.filter(r => r.success).length
    const failCount = results.length - successCount

    // 创建 Supabase 客户端
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 保存发送记录
    const { error: dbError } = await supabaseClient
      .from('sms_records')
      .insert(results.map(result => ({
        tenant_id: '12345',
        send_code: Math.random().toString(36).substring(7),
        template_name: 'default',
        sms_type: 'text',
        recipients: [result.phone],
        content: content,
        success_count: result.success ? 1 : 0,
        fail_count: result.success ? 0 : 1,
        status: 'pending',
        mid: result.mid // 保存消息ID用于后续状态更新
      })))

    if (dbError) {
      console.error('保存短信记录错误:', dbError)
      throw dbError
    }

    // 详细的响应信息
    const response = {
      success: failCount === 0,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount
      },
      details: results.map(r => ({
        phone: r.phone,
        status: r.success ? '成功' : '失败',
        message: r.message
      }))
    }

    console.log('最终响应:', response)

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('处理短信请求时发生错误:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: '发送短信时发生错误'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})