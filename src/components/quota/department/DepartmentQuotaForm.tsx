import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery } from '@tanstack/react-query';

// 部门数据类型
interface Department {
  id: string;
  name: string;
}

// 表单验证模式
const quotaFormSchema = z.object({
  timeUnit: z.enum(['day', 'week', 'month'], {
    required_error: '请选择时间维度',
  }),
  departments: z.array(z.object({
    departmentId: z.string(),
    departmentName: z.string(),
    quotaAmount: z.number().min(0, '额度必须大于0'),
  })),
});

type QuotaFormValues = z.infer<typeof quotaFormSchema>;

// 获取部门列表
const fetchDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('id, name');
  
  if (error) throw error;
  return data as Department[];
};

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // 使用 React Query 获取部门列表
  const { data: departments = [], isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  const form = useForm<QuotaFormValues>({
    resolver: zodResolver(quotaFormSchema),
    defaultValues: {
      timeUnit: 'month',
      departments: [],
    },
  });

  // 当部门数据加载完成后，初始化表单数据
  useEffect(() => {
    if (departments.length > 0) {
      form.setValue('departments', departments.map(dept => ({
        departmentId: dept.id,
        departmentName: dept.name,
        quotaAmount: 0,
      })));
    }
  }, [departments, form.setValue]);

  // 提交表单
  const onSubmit = async (data: QuotaFormValues) => {
    try {
      setLoading(true);
      
      // 获取当前用户的tenant_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!userData?.tenant_id) throw new Error('无法获取租户信息');

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
            tenant_id: userData.tenant_id,
            department_id: dept.departmentId,
            time_unit: data.timeUnit,
            quota_amount: dept.quotaAmount,
            remaining_amount: dept.quotaAmount,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            created_by: user.id
          }))
        );

      if (error) throw error;

      toast({
        title: '额度分配成功',
        description: '已成功为部门分配额度',
      });
      
      // 重置表单中的额度数值
      form.setValue('departments', data.departments.map(dept => ({
        ...dept,
        quotaAmount: 0,
      })));
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '额度分配失败',
        description: '请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isDepartmentsLoading) {
    return <div className="text-center py-4">加载部门数据中...</div>;
  }

  if (departments.length === 0) {
    return <div className="text-center py-4">暂无部门数据</div>;
  }

  return (
    <Form {...form}>
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
          <div className="border rounded-lg p-4">
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <FormField
                  key={dept.id}
                  control={form.control}
                  name={`departments.${index}.quotaAmount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dept.name}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="请输入额度"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? '提交中...' : '确认分配'}
        </Button>
      </form>
    </Form>
  );
};