import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 获取环境变量
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 解析回调数据
    const callbackData = await req.json();
    console.log('收到短信回调数据:', callbackData);

    // 预期的回调数据格式:
    // {
    //   mid: "消息ID",
    //   status: "发送状态",
    //   message: "状态描述",
    //   receive_time: "接收时间"
    // }

    if (!callbackData.mid) {
      throw new Error('缺少消息ID(mid)');
    }

    // 更新数据库中的短信记录
    const { error: updateError } = await supabase
      .from('sms_records')
      .update({
        status: callbackData.status === '0' ? 'success' : 'failed',
        delivery_status: callbackData.status === '0' ? 'delivered' : 'failed',
        delivery_time: new Date().toISOString(),
        delivery_code: callbackData.status,
        delivery_message: callbackData.message || '状态更新'
      })
      .eq('mid', callbackData.mid);

    if (updateError) {
      console.error('更新短信记录失败:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('处理短信回调时发生错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});