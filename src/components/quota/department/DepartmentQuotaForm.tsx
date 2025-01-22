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
import { Checkbox } from '@/components/ui/checkbox';

interface DepartmentQuotaFormData {
  timeUnit: string;
  quotas: {
    departmentId: string;
    amount: number;
  }[];
  useBatchMode: boolean;
  batchAmount: number;
}

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<DepartmentQuotaFormData>({
    defaultValues: {
      timeUnit: 'day',
      quotas: [],
      useBatchMode: false,
      batchAmount: 0,
    },
  });

  const useBatchMode = watch('useBatchMode');
  const batchAmount = watch('batchAmount');

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

  // 获取钱包余额
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('tenant_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleBatchModeChange = (checked: boolean) => {
    setValue('useBatchMode', checked);
    if (checked && departments) {
      // 如果启用批量模式，将所有部门的额度设置为相同值
      departments.forEach((_, index) => {
        setValue(`quotas.${index}.amount`, batchAmount);
      });
    }
  };

  const handleBatchAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    setValue('batchAmount', amount);
    if (useBatchMode && departments) {
      // 更新所有部门的额度
      departments.forEach((_, index) => {
        setValue(`quotas.${index}.amount`, amount);
      });
    }
  };

  const onSubmit = async (data: DepartmentQuotaFormData) => {
    try {
      // 计算总额度
      const totalAmount = data.quotas.reduce((sum, quota) => sum + (quota.amount || 0), 0);
      
      // 检查钱包余额
      if (wallet && totalAmount > wallet.balance) {
        toast({
          variant: 'destructive',
          title: '余额不足',
          description: '当前钱包余额不足以完成此次分配',
        });
        return;
      }

      // 获取当前用户的tenant_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!userData) throw new Error('未找到用户信息');

      const now = new Date();
      let endDate = new Date();
      
      // 根据时间维度设置结束时间
      switch (data.timeUnit) {
        case 'week':
          endDate.setDate(now.getDate() + 7);
          break;
        case 'month':
          endDate.setMonth(now.getMonth() + 1);
          break;
        default: // day
          endDate.setDate(now.getDate() + 1);
      }

      // 批量插入部门额度记录
      const { error } = await supabase.from('department_quotas').insert(
        data.quotas
          .filter(quota => quota.amount > 0) // 只插入额度大于0的记录
          .map(quota => ({
            tenant_id: userData.tenant_id,
            department_id: quota.departmentId,
            quota_amount: quota.amount,
            remaining_amount: quota.amount, // 初始剩余额度等于总额度
            time_unit: data.timeUnit,
            start_date: now.toISOString(),
            end_date: endDate.toISOString(),
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="batchMode"
          checked={useBatchMode}
          onCheckedChange={handleBatchModeChange}
        />
        <label
          htmlFor="batchMode"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          批量设置额度
        </label>
      </div>

      {useBatchMode && (
        <div className="flex items-center gap-4">
          <span className="w-32">批量额度：</span>
          <Input
            type="number"
            placeholder="输入统一额度"
            value={batchAmount}
            onChange={handleBatchAmountChange}
            className="w-32"
          />
        </div>
      )}

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
              disabled={useBatchMode}
            />
            <input
              type="hidden"
              {...register(`quotas.${index}.departmentId` as const)}
              value={dept.id}
            />
          </div>
        ))}
      </div>

      {wallet && (
        <div className="text-sm text-gray-500">
          当前钱包余额：{wallet.balance} 元
        </div>
      )}

      <Button type="submit">
        确认分配
      </Button>
    </form>
  );
};