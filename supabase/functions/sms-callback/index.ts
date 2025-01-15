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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 解析回调数据
    const callbackData = await req.json()
    console.log('收到短信回调数据:', callbackData)

    // 判断是否为数组
    const reports = Array.isArray(callbackData) ? callbackData : [callbackData]

    // 处理每条状态报告
    for (const report of reports) {
      const {
        mid, // 消息ID
        mobile, // 手机号
        stat, // 状态码
        time, // 状态报告时间
      } = report

      // 根据 mid 查找对应的短信记录
      const { data: smsRecords, error: queryError } = await supabaseClient
        .from('sms_records')
        .select('*')
        .eq('mid', mid)
        .single()

      if (queryError) {
        console.error('查询短信记录失败:', queryError)
        continue
      }

      if (!smsRecords) {
        console.error('未找到对应的短信记录:', mid)
        continue
      }

      // 更新发送状态
      const status = stat === 'DELIVRD' ? 'success' : 'failed'
      const { error: updateError } = await supabaseClient
        .from('sms_records')
        .update({
          status,
          send_time: time,
          success_count: status === 'success' ? 1 : 0,
          fail_count: status === 'failed' ? 1 : 0
        })
        .eq('mid', mid)

      if (updateError) {
        console.error('更新短信状态失败:', updateError)
        continue
      }

      console.log(`短信状态更新成功 - ID: ${mid}, 状态: ${status}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OK' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('处理回调请求失败:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})