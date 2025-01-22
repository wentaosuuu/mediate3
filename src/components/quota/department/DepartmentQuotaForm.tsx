import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DepartmentQuotaFormData {
  timeUnit: string;
  quotas: {
    departmentId: string;
    amount: number;
  }[];
}

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<DepartmentQuotaFormData>({
    defaultValues: {
      timeUnit: 'day',
      quotas: [],
    },
  });

  // 获取部门列表
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');
      
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: DepartmentQuotaFormData) => {
    try {
      // 获取当前用户的tenant_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!userData) throw new Error('未找到用户信息');

      // 批量插入部门额度记录
      const { error } = await supabase.from('department_quotas').insert(
        data.quotas.map(quota => ({
          tenant_id: userData.tenant_id,
          department_id: quota.departmentId,
          quota_amount: quota.amount,
          time_unit: data.timeUnit,
          start_date: new Date(),
          end_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 默认一天
        }))
      );

      if (error) throw error;

      toast({
        title: '分配成功',
        description: '部门额度已成功分配',
      });
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '分配失败',
        description: '分配部门额度时发生错误',
      });
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-gray-500" />
        <Select
          defaultValue="day"
          onValueChange={(value) => setValue('timeUnit', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间维度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">按天</SelectItem>
            <SelectItem value="week">按周</SelectItem>
            <SelectItem value="month">按月</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {departments?.map((dept, index) => (
          <div key={dept.id} className="flex items-center gap-4">
            <span className="w-32">{dept.name}</span>
            <Input
              type="number"
              placeholder="输入额度"
              {...register(`quotas.${index}.amount` as const, {
                valueAsNumber: true,
                required: true,
                min: 0,
              })}
              className="w-32"
            />
            <input
              type="hidden"
              {...register(`quotas.${index}.departmentId` as const)}
              value={dept.id}
            />
          </div>
        ))}
      </div>

      <Button type="submit">
        确认分配
      </Button>
    </form>
  );
};