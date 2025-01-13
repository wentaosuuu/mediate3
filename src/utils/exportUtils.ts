import * as XLSX from 'xlsx';
import { SmsRecord } from '@/types/sms';

// 将日期格式化为字符串
const formatDate = (date: string | null) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
};

// 将短信记录转换为Excel格式的数据
const transformSmsRecordsForExcel = (records: SmsRecord[]) => {
  return records.map((record) => ({
    '流水ID': record.id,
    '批次号': record.send_code,
    '客户姓名/手机': record.recipients.join(', '),
    '短信类型': record.sms_type,
    '短信内容': record.content,
    '发送成功数': record.success_count || 0,
    '发送失败数': record.fail_count || 0,
    '超频失败数': record.frequency_fail_count || 0,
    '发送时间': formatDate(record.send_time),
    '创建时间': formatDate(record.created_at),
    '发送人': record.created_by || '-',
    '状态': record.status || '待发送'
  }));
};

// 导出SMS记录到Excel
export const exportSmsRecordsToExcel = (records: SmsRecord[]) => {
  // 转换数据
  const excelData = transformSmsRecordsForExcel(records);
  
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  
  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '短信发送记录');
  
  // 生成Excel文件并下载
  XLSX.writeFile(wb, `短信发送记录_${new Date().toISOString().split('T')[0]}.xlsx`);
};