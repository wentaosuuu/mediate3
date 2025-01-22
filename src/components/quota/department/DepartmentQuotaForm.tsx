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

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<QuotaFormValues>({
    resolver: zodResolver(quotaFormSchema),
    defaultValues: {
      timeUnit: 'month',
      departments: [],
    },
  });

  // 获取部门列表
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // TODO: 替换为实际的部门数据获取逻辑
        const mockDepartments = [
          { id: '1', name: '技术部' },
          { id: '2', name: '市场部' },
          { id: '3', name: '销售部' },
        ];
        setDepartments(mockDepartments);
        
        // 初始化表单的部门数据
        form.setValue('departments', mockDepartments.map(dept => ({
          departmentId: dept.id,
          departmentName: dept.name,
          quotaAmount: 0,
        })));
      } catch (error) {
        console.error('获取部门列表失败:', error);
        toast({
          variant: 'destructive',
          title: '获取部门列表失败',
          description: '请稍后重试',
        });
      }
    };

    fetchDepartments();
  }, []);

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
            {departments.length === 0 ? (
              <p className="text-muted-foreground">暂无部门数据</p>
            ) : (
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
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? '提交中...' : '确认分配'}
        </Button>
      </form>
    </Form>
  );
};