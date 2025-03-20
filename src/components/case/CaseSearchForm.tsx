
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  CheckSquare, 
  PackageCheck, 
  FileDown
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ColumnSelector } from './ColumnSelector';
import { DateRange } from '@/types/case';

// 修改schema定义，确保DateRange类型正确
const searchSchema = z.object({
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

type SearchFormValues = z.infer<typeof searchSchema>;

interface CaseSearchFormProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  onAddCase: () => void;
  onImportCases: () => void;
  onExportCases: () => void;
  onColumnsChange: (columns: string[]) => void;
  visibleColumns: string[];
  onSelectedDistribution: () => void;
  onOneClickClose: () => void;
  onDownloadTemplate: () => void;
}

export const CaseSearchForm = ({
  onSearch,
  onReset,
  onAddCase,
  onImportCases,
  onExportCases,
  onColumnsChange,
  visibleColumns,
  onSelectedDistribution,
  onOneClickClose,
  onDownloadTemplate,
}: CaseSearchFormProps) => {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      caseNumber: '',
      batchNumber: '',
      borrowerNumber: '',
      idNumber: '',
      customerName: '',
      phone: '',
      productLine: '',
      receiver: '',
      adjuster: '',
      distributor: '',
      progressStatus: '',
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    // 转换日期范围为字符串格式
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
    
    onSearch(transformedValues);
  };

  const handleReset = () => {
    form.reset();
    onReset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="caseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>案件编号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入案件编号" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>批次编号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入批次编号" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="borrowerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>借据编号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入借据编号" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>身份证号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入身份证号" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>客户姓名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入客户姓名" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入手机号" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>产品线</FormLabel>
                <FormControl>
                  <Input placeholder="请输入产品线" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>受托方</FormLabel>
                <FormControl>
                  <Input placeholder="请输入受托方" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adjuster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>调解员</FormLabel>
                <FormControl>
                  <Input placeholder="请输入调解员" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distributor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>分案员</FormLabel>
                <FormControl>
                  <Input placeholder="请输入分案员" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="latestProgressTimeRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最新跟进时间</FormLabel>
                <DateRangePicker 
                  value={field.value as DateRange} 
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="latestEditTimeRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最新编辑时间</FormLabel>
                <DateRangePicker 
                  value={field.value as DateRange}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distributionTimeRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>分案时间</FormLabel>
                <DateRangePicker 
                  value={field.value as DateRange}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caseEntryTimeRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>案件入库时间</FormLabel>
                <DateRangePicker 
                  value={field.value as DateRange}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex flex-wrap gap-2">
            <ColumnSelector 
              visibleColumns={visibleColumns} 
              onChange={onColumnsChange} 
            />
            <Button type="button" onClick={onAddCase}>
              <Plus className="mr-2 h-4 w-4" />
              新增
            </Button>
            <Button type="button" variant="outline" onClick={onImportCases}>
              <Upload className="mr-2 h-4 w-4" />
              导入案件
            </Button>
            <Button type="button" variant="outline" onClick={onExportCases}>
              <Download className="mr-2 h-4 w-4" />
              导出案件
            </Button>
            <Button type="button" variant="outline" onClick={onSelectedDistribution}>
              <CheckSquare className="mr-2 h-4 w-4" />
              选中分案
            </Button>
            <Button type="button" variant="outline" onClick={onOneClickClose}>
              <PackageCheck className="mr-2 h-4 w-4" />
              一键结案
            </Button>
            <Button type="button" variant="outline" onClick={onDownloadTemplate}>
              <FileDown className="mr-2 h-4 w-4" />
              下载案件导入模板
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline" type="button" onClick={handleReset}>
              <Filter className="mr-2 h-4 w-4" />
              重置
            </Button>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              查询
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
