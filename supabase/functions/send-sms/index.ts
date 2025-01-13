// 导入必要的依赖
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { create } from "https://deno.land/x/djwt@v2.4/mod.ts"

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
    const { phoneNumbers, content, transactionId } = await req.json()

    console.log('接收到短信请求:', { phoneNumbers, content, transactionId })

    if (!phoneNumbers || !content) {
      throw new Error('手机号码和短信内容不能为空')
    }

    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 构建短信内容
    const smsContent = `【云宝宝】您的验证码是${verificationCode}`;

    // API所需参数
    const account = 'yb1206';
    const rawPassword = 'nr4brb';
    const timestamp = new Date().getTime().toString();

    // 构建签名字符串: account + password + timestamp
    const signStr = `${account}${rawPassword}${timestamp}`;
    console.log('签名字符串:', signStr);

    // 使用 TextEncoder 和 crypto.subtle.digest 计算 SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(signStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('签名:', signature);

    // 构建请求体
    const requestBody = {
      account,
      phones: phoneNumbers,
      content: smsContent,
      sign: signature,
      timestamp,
      extno: "01"
    };

    console.log('发送短信请求参数:', {
      url: 'http://112.74.139.4:8002/api/sms/batch/v1', // 更新了 API 路径
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    try {
      // 发送POST请求到短信API
      const response = await fetch('http://112.74.139.4:8002/api/sms/batch/v1', { // 更新了 API 路径
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('短信API响应状态:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('短信API原始响应:', responseText);

      // 尝试解析响应
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = responseText;
      }
      
      console.log('处理后的响应:', result);

      // 根据API文档判断是否发送成功
      const success = response.status === 200 && result?.code === '0';

      return new Response(
        JSON.stringify({
          success,
          errorDesc: success ? null : `发送失败: ${typeof result === 'string' ? result : JSON.stringify(result)}`,
          result,
          verificationCode,
          requestUrl: 'http://112.74.139.4:8002/api/sms/batch/v1', // 更新了 API 路径
          rawResponse: result
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: success ? 200 : 400
        }
      );
    } catch (fetchError) {
      console.error('调用短信API时发生错误:', fetchError);
      throw new Error(`调用短信API失败: ${fetchError.message}`);
    }

  } catch (error) {
    console.error('发送短信时发生错误:', error);
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
    );
  }
});