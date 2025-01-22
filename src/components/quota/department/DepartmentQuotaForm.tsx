import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TimeUnitSelector } from './components/TimeUnitSelector';
import { DepartmentSelector } from './components/DepartmentSelector';
import { ServiceTypeSelector } from './components/ServiceTypeSelector';
import { QuotaAmountInput } from './components/QuotaAmountInput';
import { DateRange } from 'react-day-picker';

interface DepartmentQuotaFormData {
  timeUnit: string;
  departmentId: string;
  serviceType: string;
  amount: number;
  dateRange?: DateRange;
}

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<DepartmentQuotaFormData>({
    defaultValues: {
      timeUnit: 'day',
      departmentId: '',
      serviceType: '',
      amount: undefined,
      dateRange: undefined,
    },
  });

  // 获取钱包余额
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      return { balance: 6666 };
    },
  });

  const onSubmit = async (data: DepartmentQuotaFormData) => {
    try {
      // 检查钱包余额
      if (wallet && data.amount > wallet.balance) {
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

      let startDate = new Date();
      let endDate = new Date();
      
      // 根据时间维度设置结束时间
      if (data.timeUnit === 'custom' && data.dateRange) {
        startDate = data.dateRange.from || new Date();
        endDate = data.dateRange.to || new Date();
      } else {
        switch (data.timeUnit) {
          case 'week':
            endDate.setDate(startDate.getDate() + 7);
            break;
          case 'month':
            endDate.setMonth(startDate.getMonth() + 1);
            break;
          default: // day
            endDate.setDate(startDate.getDate() + 1);
        }
      }

      // 创建部门额度记录
      const { error } = await supabase.from('department_quotas').insert({
        tenant_id: userData.tenant_id,
        department_id: data.departmentId,
        service_type: data.serviceType,
        quota_amount: data.amount,
        remaining_amount: data.amount,
        time_unit: data.timeUnit,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <TimeUnitSelector
        value={watch('timeUnit')}
        onValueChange={(value) => setValue('timeUnit', value)}
        dateRange={watch('dateRange')}
        onDateRangeChange={(range) => setValue('dateRange', range)}
      />

      <div className="space-y-4">
        <DepartmentSelector
          value={watch('departmentId')}
          onValueChange={(value) => setValue('departmentId', value)}
        />

        <ServiceTypeSelector
          value={watch('serviceType')}
          onValueChange={(value) => setValue('serviceType', value)}
        />

        <QuotaAmountInput
          value={watch('amount')}
          onChange={(e) => setValue('amount', Number(e.target.value))}
        />
      </div>

      {wallet && (
        <div className="text-sm text-gray-500">
          当前钱包余额：{wallet.balance} 元
        </div>
      )}

      <Button type="submit" className="w-full">
        确认分配
      </Button>
    </form>
  );
};