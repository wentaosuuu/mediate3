export interface SmsRecord {
  id: string;
  tenant_id: string;
  send_code: string;
  template_name: string;
  sms_type: string;
  recipients: string[];
  send_time: string | null;
  success_count: number | null;
  fail_count: number | null;
  frequency_fail_count: number | null;
  content: string;
  created_at: string | null;
  created_by: string | null;
  status: string | null;
  delivery_message: string | null;  // 添加发送状态消息字段
  delivery_time: string | null;     // 添加发送完成时间字段
}

export interface SmsSearchParams {
  content?: string;
  customerInfo?: string;
  smsType?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}