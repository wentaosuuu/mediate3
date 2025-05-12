
import { z } from 'zod';

// 案件表单验证schema
export const caseSchema = z.object({
  case_number: z.string().min(1, '案件编号不能为空'),
  batch_number: z.string().min(1, '批次编号不能为空'),
  borrower_number: z.string().min(1, '借据编号不能为空'),
  id_number: z.string().min(1, '身份证号不能为空'),
  customer_name: z.string().min(1, '客户姓名不能为空'),
  phone: z.string().nullable().optional(),
  product_line: z.string().nullable().optional(),
  receiver: z.string().nullable().optional(),
  adjuster: z.string().nullable().optional(),
  distributor: z.string().nullable().optional(),
  progress_status: z.string().nullable().optional(),
  latest_progress_time: z.string().nullable().optional(),
  latest_edit_time: z.string().nullable().optional(),
  case_entry_time: z.string().nullable().optional(),
  distribution_time: z.string().nullable().optional(),
  result_time: z.string().nullable().optional(),
});

// 案件表单字段配置
export const caseFields = [
  { name: 'case_number', label: '案件编号', required: true },
  { name: 'batch_number', label: '批次编号', required: true },
  { name: 'borrower_number', label: '借据编号', required: true },
  { name: 'id_number', label: '身份证号', required: true },
  { name: 'customer_name', label: '客户姓名', required: true },
  { name: 'phone', label: '手机号', required: false },
  { name: 'product_line', label: '产品线', required: false },
  { name: 'receiver', label: '受托方', required: false },
  { name: 'adjuster', label: '调解员', required: false },
  { name: 'distributor', label: '分案员', required: false },
  { name: 'progress_status', label: '跟进状态', required: false },
];

// 导入Excel时的列映射（Excel列名到数据库字段的映射）
export const excelColumnMapping = {
  '案件编号': 'case_number',
  '批次编号': 'batch_number',
  '借据编号': 'borrower_number',
  '身份证号': 'id_number',
  '客户姓名': 'customer_name',
  '手机号': 'phone',
  '产品线': 'product_line',
  '受托方': 'receiver',
  '调解员': 'adjuster',
  '分案员': 'distributor',
  '跟进状态': 'progress_status',
};
