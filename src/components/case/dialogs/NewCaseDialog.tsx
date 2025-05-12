
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { caseSchema } from '../form-config/caseFormConfig';
import type { Case } from '@/types/case';

interface NewCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newCase: Case) => void;
}

export const NewCaseDialog: React.FC<NewCaseDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess 
}) => {
  // 使用 React Hook Form 和 zod 验证
  const form = useForm<Omit<Case, 'id'>>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      case_number: '',
      batch_number: '',
      borrower_number: '',
      id_number: '',
      customer_name: '',
      phone: '',
      product_line: '',
      receiver: '',
      adjuster: '',
      distributor: '',
      progress_status: '待分配',
    }
  });

  const onSubmit = async (data: Omit<Case, 'id'>) => {
    try {
      // 这里模拟API调用，实际应用中需要接入后端API
      // 生成一个临时ID作为示例
      const tempId = Math.random().toString(36).substring(2, 15);
      const newCase: Case = {
        id: tempId,
        ...data,
        latest_progress_time: new Date().toISOString(),
        latest_edit_time: new Date().toISOString(),
        case_entry_time: new Date().toISOString(),
        distribution_time: null,
        result_time: null,
      };
      
      // 通知父组件添加成功
      onSuccess(newCase);
      
      // 重置表单并关闭对话框
      form.reset();
      onOpenChange(false);
      
      // 显示成功提示
      toast.success('案件添加成功');
    } catch (error) {
      console.error('添加案件失败:', error);
      toast.error('添加案件失败，请重试');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新增案件</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 案件编号 */}
              <FormField
                control={form.control}
                name="case_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>案件编号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入案件编号" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* 批次编号 */}
              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>批次编号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入批次编号" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* 借据编号 */}
              <FormField
                control={form.control}
                name="borrower_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>借据编号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入借据编号" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* 身份证号 */}
              <FormField
                control={form.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>身份证号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入身份证号" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* 客户姓名 */}
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>客户姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入客户姓名" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* 手机号 */}
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
              
              {/* 产品线 */}
              <FormField
                control={form.control}
                name="product_line"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>产品线</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入产品线" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* 受托方 */}
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
              
              {/* 调解员 */}
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
              
              {/* 分案员 */}
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
              
              {/* 跟进状态 */}
              <FormField
                control={form.control}
                name="progress_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>跟进状态</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入跟进状态" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit">提交</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
