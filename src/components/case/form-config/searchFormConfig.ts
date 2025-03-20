
// 搜索表单配置文件
import { z } from 'zod';

// 搜索表单验证模式
export const searchSchema = z.object({
  caseNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  borrowerNumber: z.string().optional(),
  idNumber: z.string().optional(),
  customerName: z.string().optional(),
  phone: z.string().optional(),
  productLine: z.string().optional(),
  receiver: z.string().optional(),
  adjuster: z.string().optional(),
  distributor: z.string().optional(),
  progressStatus: z.string().optional(),
  latestProgressTimeRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }).optional().transform(val => val ? { from: val.from || undefined, to: val.to || undefined } : undefined),
  latestEditTimeRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }).optional().transform(val => val ? { from: val.from || undefined, to: val.to || undefined } : undefined),
  caseEntryTimeRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }).optional().transform(val => val ? { from: val.from || undefined, to: val.to || undefined } : undefined),
  distributionTimeRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }).optional().transform(val => val ? { from: val.from || undefined, to: val.to || undefined } : undefined),
});

export type SearchFormValues = z.infer<typeof searchSchema>;

// 文本字段配置
export const textFields = [
  { name: 'caseNumber', label: '案件编号' },
  { name: 'batchNumber', label: '批次编号' },
  { name: 'borrowerNumber', label: '借据编号' },
  { name: 'idNumber', label: '身份证号' },
  { name: 'customerName', label: '客户姓名' },
  { name: 'phone', label: '手机号' },
  { name: 'productLine', label: '产品线' },
  { name: 'receiver', label: '受托方' },
  { name: 'adjuster', label: '调解员' },
  { name: 'distributor', label: '分案员' },
];

// 日期范围字段配置
export const dateRangeFields = [
  { name: 'latestProgressTimeRange', label: '最新跟进时间' },
  { name: 'latestEditTimeRange', label: '最新编辑时间' },
  { name: 'distributionTimeRange', label: '分案时间' },
  { name: 'caseEntryTimeRange', label: '案件入库时间' },
];

// 转换日期范围为字符串格式的函数
export const transformDateRanges = (values: SearchFormValues) => {
  const transformedValues = {
    ...values,
    latestProgressStartTime: values.latestProgressTimeRange?.from?.toISOString(),
    latestProgressEndTime: values.latestProgressTimeRange?.to?.toISOString(),
    latestEditStartTime: values.latestEditTimeRange?.from?.toISOString(),
    latestEditEndTime: values.latestEditTimeRange?.to?.toISOString(),
    caseEntryStartTime: values.caseEntryTimeRange?.from?.toISOString(),
    caseEntryEndTime: values.caseEntryTimeRange?.to?.toISOString(),
    distributionStartTime: values.distributionTimeRange?.from?.toISOString(),
    distributionEndTime: values.distributionTimeRange?.to?.toISOString()
  };
  
  // 移除中间的日期范围对象，只使用开始和结束时间字段
  delete transformedValues.latestProgressTimeRange;
  delete transformedValues.latestEditTimeRange;
  delete transformedValues.caseEntryTimeRange;
  delete transformedValues.distributionTimeRange;
  
  return transformedValues;
};
