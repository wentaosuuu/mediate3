import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Upload, Download } from 'lucide-react';
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
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface CaseSearchFormProps {
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
  onAddCase: () => void;
  onImportCases: () => void;
  onExportCases: () => void;
}

export const CaseSearchForm = ({
  onSearch,
  onReset,
  onAddCase,
  onImportCases,
  onExportCases,
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
      startTime: '',
      endTime: '',
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    onSearch(values);
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
        </div>
        <div className="mt-4 flex justify-between">
          <div className="space-x-2">
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