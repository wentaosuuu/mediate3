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

    console.log('接收到短信请求:', { phoneNumbers, content, transactionId })

    if (!phoneNumbers || !content) {
      throw new Error('手机号码和短信内容不能为空')
    }

    // 构建请求参数
    const params = new URLSearchParams()
    params.append('account', SMS_CONFIG.account)
    params.append('password', SMS_CONFIG.password)
    params.append('mobile', phoneNumbers)
    params.append('content', content)
    params.append('reqid', transactionId)
    params.append('resptype', '1')  // 返回json格式
    params.append('sign', '【云宝宝】')

    console.log('发送短信请求参数:', params.toString())
    console.log('发送短信URL:', SMS_CONFIG.url)

    // 调用短信接口
    const response = await fetch(SMS_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    console.log('短信API响应状态:', response.status, response.statusText)
    
    let result
    try {
      const text = await response.text()
      console.log('短信API响应内容:', text)
      result = JSON.parse(text)
    } catch (e) {
      console.error('解析响应失败:', e)
      throw new Error('解析短信接口响应失败')
    }
    
    console.log('解析后的响应:', result)

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
    console.error('发送短信时发生错误:', error)
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