// 导入必要的依赖
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

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
    const account = "109652";
    const password = "waRwR3";
    const extno = "10690545612";

    // 将手机号码字符串转换为数组并去除空格
    const phoneNumberList = phoneNumbers.split(',').map(phone => phone.trim());
    console.log('处理后的手机号列表:', phoneNumberList);

    // 为每个手机号发送短信
    const results = await Promise.all(phoneNumberList.map(async (phone) => {
      // 构建完整的 URL，包含所有参数
      const apiUrl = new URL('http://39.107.242.113:7862/sms');
      apiUrl.searchParams.append('action', 'send');
      apiUrl.searchParams.append('account', account);
      apiUrl.searchParams.append('password', password);
      apiUrl.searchParams.append('mobile', phone);
      apiUrl.searchParams.append('content', content);
      apiUrl.searchParams.append('extno', extno);
      apiUrl.searchParams.append('rt', 'json');

      console.log('发送短信请求URL:', apiUrl.toString());

      try {
        const response = await fetch(apiUrl.toString());
        const result = await response.json();
        console.log('短信API响应:', result);
        
        // 根据 API 响应判断是否发送成功
        const success = result.status === '0';
        return { 
          phone, 
          success, 
          result,
          message: success ? '发送成功' : `发送失败: ${result.message || '未知错误'}`
        };
      } catch (error) {
        console.error('发送短信失败:', error);
        return { 
          phone, 
          success: false, 
          error: error.message,
          message: `发送失败: ${error.message}`
        };
      }
    }));

    // 统计发送结果
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

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
    };

    console.log('最终响应:', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // 即使有失败的情况也返回 200，让前端根据 success 字段判断
      }
    );

  } catch (error) {
    console.error('处理短信请求时发生错误:', error);
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
    );
  }
});