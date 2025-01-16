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
    const smsApiUrl = Deno.env.get('SMS_API_URL')!;
    const smsAccount = Deno.env.get('SMS_ACCOUNT')!;
    const smsPassword = Deno.env.get('SMS_PASSWORD')!;

    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 获取所有待处理的短信记录
    const { data: pendingRecords, error: fetchError } = await supabase
      .from('sms_records')
      .select('*')
      .eq('delivery_status', 'pending')
      .limit(100);

    if (fetchError) {
      throw new Error(`获取待处理记录失败: ${fetchError.message}`);
    }

    if (!pendingRecords || pendingRecords.length === 0) {
      return new Response(
        JSON.stringify({ message: '没有待处理的记录' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 批量查询短信状态
    const statusUpdates = await Promise.all(pendingRecords.map(async (record) => {
      if (!record.mid) return null;

      // 构建状态查询 URL
      const statusUrl = new URL(smsApiUrl);
      statusUrl.searchParams.append('action', 'query');
      statusUrl.searchParams.append('account', smsAccount);
      statusUrl.searchParams.append('password', smsPassword);
      statusUrl.searchParams.append('mid', record.mid);
      statusUrl.searchParams.append('rt', 'json');

      try {
        const response = await fetch(statusUrl.toString());
        const result = await response.json();
        
        // 解析状态响应
        const status = result.status === '0' ? 'delivered' : 'failed';
        const deliveryTime = new Date().toISOString();
        
        // 更新数据库记录
        const { error: updateError } = await supabase
          .from('sms_records')
          .update({
            delivery_status: status,
            delivery_time: deliveryTime,
            delivery_code: result.status,
            delivery_message: result.message || '状态查询成功'
          })
          .eq('id', record.id);

        if (updateError) {
          console.error(`更新记录 ${record.id} 失败:`, updateError);
          return null;
        }

        return {
          id: record.id,
          status,
          message: result.message
        };
      } catch (error) {
        console.error(`查询记录 ${record.id} 状态失败:`, error);
        return null;
      }
    }));

    // 过滤掉空值并返回结果
    const validUpdates = statusUpdates.filter(Boolean);

    return new Response(
      JSON.stringify({
        success: true,
        updates: validUpdates,
        total_processed: pendingRecords.length,
        total_updated: validUpdates.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('处理短信状态查询时发生错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});