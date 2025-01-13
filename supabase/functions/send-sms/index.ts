import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 短信接口配置
const SMS_CONFIG = {
  account: 'yb1206',
  password: 'nr4brb',
  url: 'http://www.dh3t.com/json/sms/BatchSubmit'  // 更新为新的URL
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
    params.append('resptype', '1')  // 使用 resptype=1

    // 构建完整的请求URL
    const requestUrl = `${SMS_CONFIG.url}?${params.toString()}`
    console.log('完整请求URL:', requestUrl)

    try {
      // 使用 GET 请求调用短信接口
      const response = await fetch(requestUrl)
      console.log('短信API响应状态:', response.status, response.statusText)
      
      const text = await response.text()
      console.log('短信API原始响应:', text)

      // 尝试解析响应
      let result
      try {
        // 如果是JSON格式
        result = JSON.parse(text)
      } catch {
        // 如果不是JSON格式，按照文本处理
        result = text
      }
      
      console.log('处理后的响应:', result)

      // 根据响应确定是否发送成功
      const success = response.status === 200 && (
        (typeof result === 'string' && result.includes('0')) || 
        (typeof result === 'object' && (result.code === '0' || result.code === 0))
      )

      return new Response(
        JSON.stringify({
          success,
          errorDesc: success ? null : `发送失败: ${typeof result === 'string' ? result : JSON.stringify(result)}`,
          result,
          verificationCode,
          requestUrl,
          rawResponse: result
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: success ? 200 : 400
        }
      )
    } catch (fetchError) {
      console.error('调用短信API时发生错误:', fetchError)
      throw new Error(`调用短信API失败: ${fetchError.message}`)
    }

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