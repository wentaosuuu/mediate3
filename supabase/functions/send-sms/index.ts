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
    const { phoneNumbers, content, smsType, templateName, tenantId } = await req.json()
    console.log('收到发送短信请求:', { phoneNumbers, content, smsType, templateName, tenantId })

    if (!tenantId) {
      throw new Error('租户ID不能为空')
    }

    // API 参数
    const account = Deno.env.get('SMS_ACCOUNT')
    const password = Deno.env.get('SMS_PASSWORD')
    const apiUrl = Deno.env.get('SMS_API_URL')
    const extno = "10690545612"

    // 构建请求参数
    const params = new URLSearchParams({
      account,
      password,
      mobile: phoneNumbers,
      msg: content,
      extno,
      rt: 'json'
    })

    // 发送请求
    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'POST'
    })
    const text = await response.text()
    console.log('API响应:', text)

    // 尝试解析响应
    let result
    try {
      result = JSON.parse(text)
    } catch (parseError) {
      console.error('解析API响应失败:', parseError)
      throw new Error(`API 响应格式错误: ${text}`)
    }

    // 判断发送结果
    const success = result.result === '0'
    const message = success ? '发送成功' : `发送失败: ${result.desc || '未知错误'}`

    // 保存发送记录
    const { error: dbError } = await supabaseClient
      .from('sms_records')
      .insert({
        tenant_id: tenantId,
        send_code: `SMS_${Date.now()}`,
        template_name: templateName,
        sms_type: smsType,
        recipients: phoneNumbers.split(','),
        content,
        success_count: success ? phoneNumbers.split(',').length : 0,
        fail_count: success ? 0 : phoneNumbers.split(',').length,
        status: success ? 'success' : 'failed',
        mid: result.msgid
      })

    if (dbError) {
      console.error('保存发送记录失败:', dbError)
      throw dbError
    }

    return new Response(
      JSON.stringify({
        success,
        message,
        result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: success ? 200 : 400
      }
    )

  } catch (error) {
    console.error('处理发送短信请求失败:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})