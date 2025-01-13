import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 短信接口配置
const SMS_CONFIG = {
  account: 'yb1206',
  password: 'nr4brb',
  url: 'http://plate.hbsmservice.com:8080/sms/norsubmit'
}

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phoneNumbers, content, transactionId } = await req.json()

    console.log('Received SMS request:', { phoneNumbers, content, transactionId })

    if (!phoneNumbers || !content) {
      throw new Error('手机号码和短信内容不能为空')
    }

    // 构建请求参数
    const params = new URLSearchParams({
      account: SMS_CONFIG.account,
      password: SMS_CONFIG.password,
      mobile: phoneNumbers,
      content: content,
      reqid: transactionId,
      // 使用默认值
      resptype: '1',  // 返回json格式
      sign: '【云宝宝】'
    })

    console.log('Sending SMS with params:', params.toString())

    // 调用短信接口
    const response = await fetch(SMS_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    const result = await response.json()
    
    console.log('SMS API response:', result)

    // 处理响应
    const success = result.code === '0'
    return new Response(
      JSON.stringify({
        success,
        errorDesc: success ? null : `发送失败: ${result.msg || '未知错误'}`,
        result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: success ? 200 : 400
      }
    )

  } catch (error) {
    console.error('Error sending SMS:', error)
    return new Response(
      JSON.stringify({
        success: false,
        errorDesc: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})