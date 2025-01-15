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
    // 获取回调数据
    const callbackData = await req.json()
    console.log('收到短信回调:', callbackData)

    // 创建 Supabase 客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 根据 mid 查找对应的短信记录
    const { data: smsRecords, error: queryError } = await supabase
      .from('sms_records')
      .select('*')
      .eq('mid', callbackData.mid)
      .single()

    if (queryError) {
      console.error('查询短信记录失败:', queryError)
      throw queryError
    }

    if (!smsRecords) {
      throw new Error(`未找到对应的短信记录: ${callbackData.mid}`)
    }

    // 更新短信状态
    const status = callbackData.status === 'DELIVRD' ? 'success' : 'failed'
    const { error: updateError } = await supabase
      .from('sms_records')
      .update({
        status: status,
        send_time: callbackData.time,
        // 更新成功/失败数量
        success_count: status === 'success' ? 1 : 0,
        fail_count: status === 'failed' ? 1 : 0
      })
      .eq('mid', callbackData.mid)

    if (updateError) {
      console.error('更新短信记录失败:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('处理短信回调失败:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})