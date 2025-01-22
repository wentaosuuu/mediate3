import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// 表单验证模式
const quotaFormSchema = z.object({
  timeUnit: z.enum(['day', 'week', 'month'], {
    required_error: '请选择时间维度',
  }),
  departments: z.array(z.object({
    departmentId: z.string(),
    quotaAmount: z.number().min(0, '额度必须大于0'),
  })),
});

type QuotaFormValues = z.infer<typeof quotaFormSchema>;

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const form = useForm<QuotaFormValues>({
    resolver: zodResolver(quotaFormSchema),
    defaultValues: {
      timeUnit: 'month',
      departments: [],
    },
  });

  // 提交表单
  const onSubmit = async (data: QuotaFormValues) => {
    try {
      // 计算开始和结束时间
      const now = new Date();
      let startDate = new Date(now);
      let endDate = new Date(now);
      
      switch (data.timeUnit) {
        case 'day':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'week':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
      }

      // 批量插入部门额度记录
      const { error } = await supabase
        .from('department_quotas')
        .insert(
          data.departments.map(dept => ({
            department_id: dept.departmentId,
            time_unit: data.timeUnit,
            quota_amount: dept.quotaAmount,
            remaining_amount: dept.quotaAmount,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          }))
        );

      if (error) throw error;

      toast({
        title: '额度分配成功',
        description: '已成功为部门分配额度',
      });
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '额度分配失败',
        description: '请稍后重试',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Label>时间维度</Label>
        <RadioGroup
          defaultValue="month"
          onValueChange={(value) => form.setValue('timeUnit', value as 'day' | 'week' | 'month')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="day" id="day" />
            <Label htmlFor="day">按天</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="week" />
            <Label htmlFor="week">按周</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="month" />
            <Label htmlFor="month">按月</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>部门额度分配</Label>
        {/* 这里将添加部门列表和额度输入框 */}
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground">暂无部门数据</p>
        </div>
      </div>

      <Button type="submit">确认分配</Button>
    </form>
  );
};