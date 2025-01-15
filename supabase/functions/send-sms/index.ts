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
    const { phoneNumbers, content } = await req.json()
    
    console.log('接收到短信请求:', { phoneNumbers, content })

    // 验证必要参数
    if (!phoneNumbers || !content) {
      throw new Error('手机号码和短信内容不能为空')
    }

    // API参数配置
    const account = Deno.env.get('SMS_ACCOUNT')!;
    const password = Deno.env.get('SMS_PASSWORD')!;
    const extno = "10690545612";

    // 将手机号码字符串转换为数组并去除空格
    const phoneNumberList = phoneNumbers.split(',').map(phone => phone.trim());
    console.log('处理后的手机号列表:', phoneNumberList);

    // 为每个手机号发送短信
    const results = await Promise.all(phoneNumberList.map(async (phone) => {
      // 构建请求参数
      const params = new URLSearchParams({
        action: 'send',
        account,
        password,
        mobile: phone,
        content,
        extno,
        rt: 'json'
      });

      const apiUrl = Deno.env.get('SMS_API_URL')!;
      console.log('发送短信请求URL:', apiUrl);
      console.log('发送短信请求参数:', params.toString());

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString()
        });

        const responseText = await response.text();
        console.log('短信API原始响应:', responseText);

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('解析响应JSON失败:', parseError);
          return {
            phone,
            success: false,
            error: `无法解析API响应: ${responseText}`,
            message: '发送失败: API响应格式错误'
          };
        }

        console.log('解析后的API响应:', result);
        
        // 根据 API 响应判断是否发送成功
        const success = result.status === '0';
        return { 
          phone, 
          success,
          mid: result.mid, // 保存消息ID
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

    // 创建 Supabase 客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 保存发送记录
    const { error: dbError } = await supabase
      .from('sms_records')
      .insert([
        {
          tenant_id: '12345',
          send_code: Math.random().toString(36).substring(7),
          template_name: "自定义内容",
          sms_type: "营销短信",
          recipients: phoneNumberList,
          content: content,
          success_count: successCount,
          fail_count: failCount,
          status: 'pending',
          mid: results[0]?.mid // 保存消息ID用于后续状态更新
        }
      ]);

    if (dbError) {
      console.error('保存短信记录错误:', dbError);
      throw dbError;
    }

    // 详细的响应信息
    const response = {
      success: failCount === 0,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('处理短信请求时发生错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});