// 导入必要的依赖
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// MD5加密函数
function md5(message: string): string {
  const hash = crypto.createHash('md5');
  hash.update(message);
  return hash.toString();
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

    // 按照文档要求构建密码
    const account = 'yb1206';
    const rawPassword = 'nr4brb';
    // 拼接字符串: account + pwd + transactionId
    const passwordString = `${account}${rawPassword}${transactionId}`;
    console.log('密码拼接字符串:', passwordString);
    
    // 获取MD5加密后的密码
    const password = md5(passwordString);
    console.log('MD5加密后的密码:', password);

    // 构建请求体
    const requestBody = {
      account: account,
      password: password,
      transactionId: transactionId,
      list: [
        {
          mobile: phoneNumbers.replace(/\s+/g, ''),
          content: smsContent,
          uuid: transactionId,
          ext: "01"
        }
      ]
    };

    console.log('发送短信请求参数:', {
      url: 'http://www.dh3t.com/json/sms/BatchSubmit',
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    try {
      // 使用POST方法发送请求到短信API
      const response = await fetch('http://www.dh3t.com/json/sms/BatchSubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('短信API响应状态:', response.status, response.statusText);
      
      const text = await response.text();
      console.log('短信API原始响应:', text);

      // 尝试解析响应
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }
      
      console.log('处理后的响应:', result);

      // 根据响应确定是否发送成功
      const success = response.status === 200 && (
        (typeof result === 'string' && result.includes('0')) || 
        (typeof result === 'object' && (result.result === '0' || result.result === 0))
      );

      return new Response(
        JSON.stringify({
          success,
          errorDesc: success ? null : `发送失败: ${typeof result === 'string' ? result : JSON.stringify(result)}`,
          result,
          verificationCode,
          requestUrl: 'http://www.dh3t.com/json/sms/BatchSubmit',
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