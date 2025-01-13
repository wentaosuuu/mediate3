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

    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 构建短信内容
    const smsContent = `【云宝宝】您的验证码是${verificationCode}`;

    // 构建请求参数
    const params = new URLSearchParams()
    params.append('account', SMS_CONFIG.account)
    params.append('password', SMS_CONFIG.password)
    params.append('mobile', phoneNumbers.replace(/\s+/g, '')) // 移除所有空格
    params.append('content', smsContent)
    params.append('reqid', transactionId)
    params.append('resptype', 'json')

    // 构建完整的请求URL
    const requestUrl = `${SMS_CONFIG.url}?${params.toString()}`
    console.log('完整请求URL:', requestUrl)

    // 使用 GET 请求调用短信接口
    const response = await fetch(requestUrl, {
      method: 'GET',  // 改为 GET 请求
    })

    console.log('短信API响应状态:', response.status, response.statusText)
    
    let result
    try {
      const text = await response.text()
      console.log('短信API原始响应:', text)
      
      try {
        result = JSON.parse(text)
      } catch {
        // 如果不是JSON格式，创建一个标准格式的结果对象
        result = {
          code: response.status === 200 ? '0' : '1',
          msg: text
        }
      }
    } catch (e) {
      console.error('解析响应失败:', e)
      throw new Error('解析短信接口响应失败')
    }
    
    console.log('处理后的响应:', result)

    // 处理响应
    const success = result.code === '0' || result.code === 0
    return new Response(
      JSON.stringify({
        success,
        errorDesc: success ? null : `发送失败: ${result.msg || '未知错误'}`,
        result,
        verificationCode,
        requestUrl, // 返回请求URL以便调试
        rawResponse: result // 返回原始响应以便调试
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
        errorDesc: error.message,
        error: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})