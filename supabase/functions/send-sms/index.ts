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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 获取请求参数
    const { phoneNumbers, content, smsType, templateName } = await req.json()
    console.log('收到发送短信请求:', { phoneNumbers, content, smsType, templateName })

    // API 参数
    const account = Deno.env.get('SMS_ACCOUNT')
    const password = Deno.env.get('SMS_PASSWORD')
    const apiUrl = Deno.env.get('SMS_API_URL')
    const extno = "10690545612"

    // 将手机号码字符串转换为数组并去除空格
    const phoneNumberList = phoneNumbers.split(',').map(phone => phone.trim())
    console.log('处理后的手机号列表:', phoneNumberList)

    // 为每个手机号发送短信
    const results = await Promise.all(phoneNumberList.map(async (phone) => {
      try {
        // 构建请求参数
        const params = new URLSearchParams({
          account,
          password,
          mobile: phone,
          msg: content,
          extno,
          rt: 'json'
        })

        // 发送请求
        const response = await fetch(`${apiUrl}?${params.toString()}`)
        const text = await response.text()
        console.log(`手机号 ${phone} 的API响应:`, text)

        // 尝试解析响应
        let result
        try {
          result = JSON.parse(text)
        } catch (parseError) {
          console.error('解析API响应失败:', parseError)
          return { 
            phone, 
            success: false,
            error: '解析响应失败',
            message: `发送失败: API 响应格式错误 (${text.substring(0, 100)}...)`
          }
        }

        // 根据 API 响应判断是否发送成功
        const success = result.result === '0' // 修正：使用 result.result 而不是 status
        const message = success ? '发送成功' : `发送失败: ${result.desc || '未知错误'}`
        
        return { 
          phone, 
          success,
          result,
          mid: result.msgid, // 保存消息ID用于后续状态更新
          message
        }
      } catch (error) {
        console.error(`发送短信到 ${phone} 时发生错误:`, error)
        return { 
          phone, 
          success: false, 
          error: error.message,
          message: `发送失败: ${error.message}`
        }
      }
    }))

    // 统计成功和失败数量
    const successCount = results.filter(r => r.success).length
    const failCount = results.length - successCount

    // 生成发送编码
    const sendCode = `SMS_${Date.now()}`

    // 保存发送记录
    const { error: dbError } = await supabaseClient
      .from('sms_records')
      .insert({
        send_code: sendCode,
        template_name: templateName,
        sms_type: smsType,
        recipients: phoneNumberList,
        content,
        success_count: successCount,
        fail_count: failCount,
        status: successCount === results.length ? 'success' : 
                failCount === results.length ? 'failed' : 'partial',
        mid: results[0]?.mid // 保存消息ID用于后续状态更新
      })

    if (dbError) {
      console.error('保存发送记录失败:', dbError)
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

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('处理发送短信请求失败:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: [{
          status: '失败',
          message: error.message
        }]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})