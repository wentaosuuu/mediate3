// 导入必要的依赖
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// MD5加密函数
async function md5(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

    // API所需参数
    const account = 'yb1206';  // 账号
    const pwd = 'nr4brb';  // 密码

    // 只对密码进行MD5加密
    const encryptedPassword = await md5(pwd);
    console.log('密码MD5加密结果:', encryptedPassword);

    // 将手机号码字符串转换为数组
    const phoneNumberList = phoneNumbers.split(',').map(phone => phone.trim());

    // 构建短信列表
    const smsList = phoneNumberList.map((mobile, index) => ({
      mobile,
      content: content,
      uuid: `${Date.now()}${index + 1}`,  // 生成唯一的uuid
      ext: "01"  // 扩展码
    }));

    // 构建请求体 - 按照接口文档格式
    const requestBody = {
      account,
      password: encryptedPassword, // MD5加密后的密码
      transactionId,
      list: smsList
    };

    const apiUrl = 'http://www.dh3t.com/json/sms/BatchSubmit';
    console.log('发送短信请求参数:', {
      url: apiUrl,
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    try {
      // 发送POST请求到短信API
      const response = await fetch(apiUrl, {
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
      const success = response.status === 200 && result?.result === "0";

      return new Response(
        JSON.stringify({
          success,
          errorDesc: success ? null : `发送失败: ${typeof result === 'string' ? result : JSON.stringify(result)}`,
          result,
          requestUrl: apiUrl,
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