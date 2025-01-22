import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { QuotaFormLeft } from './components/QuotaFormLeft';
import { QuotaFormRight } from './components/QuotaFormRight';
import { Toaster } from '@/components/ui/toaster';

interface DepartmentQuotaFormData {
  timeUnit: string;
  departmentId: string;
  serviceType: string;
  amount: number;
  dateRange?: DateRange;
}

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<DepartmentQuotaFormData>({
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
      const { data: walletData, error } = await supabase
        .from('wallets')
        .select('balance')
        .single();
      
      if (error) {
        console.error('获取钱包余额失败:', error);
        throw error;
      }
      
      return walletData || { balance: 0 };
    },
  });

  const amount = watch('amount');
  const isExceedingBalance = wallet && amount > wallet.balance;

  const onSubmit = async (data: DepartmentQuotaFormData) => {
    try {
      // 检查钱包余额
      if (isExceedingBalance) {
        toast({
          variant: 'destructive',
          title: '余额不足',
          description: '当前钱包余额不足以完成此次分配',
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
        });
        return;
      }

      // 检查必填字段
      if (!data.departmentId || !data.serviceType || !data.amount) {
        toast({
          variant: 'destructive',
          title: '表单错误',
          description: '请填写所有必填字段',
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
        });
        return;
      }

      // 获取当前用户信息
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('未登录或获取用户信息失败');
      }

      // 获取用户的tenant_id
      const { data: userData, error: tenantError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (tenantError || !userData) {
        throw new Error('获取租户信息失败');
      }

      // 设置日期范围
      let startDate = new Date();
      let endDate = new Date();
      
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
      const { error: insertError } = await supabase
        .from('department_quotas')
        .insert({
          tenant_id: userData.tenant_id,
          department_id: data.departmentId,
          service_type: data.serviceType,
          quota_amount: data.amount,
          remaining_amount: data.amount,
          time_unit: data.timeUnit,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          created_by: user.id,
        });

      if (insertError) {
        console.error('插入错误:', insertError);
        toast({
          variant: 'destructive',
          title: '提交失败',
          description: `错误信息: ${insertError.message}`,
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
        });
        return;
      }

      // 重置表单
      reset();

      // 刷新历史记录列表
      await queryClient.invalidateQueries({ queryKey: ['department-quotas'] });

      // 显示成功消息
      toast({
        title: '分配成功',
        description: '部门额度已成功分配',
        className: 'fixed top-4 left-1/2 -translate-x-1/2 bg-green-50 border-green-200 text-green-800',
      });
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '分配失败',
        description: error instanceof Error ? error.message : '分配部门额度时发生错误',
        className: 'fixed top-4 left-1/2 -translate-x-1/2',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuotaFormLeft
          timeUnit={watch('timeUnit')}
          dateRange={watch('dateRange')}
          departmentId={watch('departmentId')}
          serviceType={watch('serviceType')}
          onTimeUnitChange={(value) => setValue('timeUnit', value)}
          onDateRangeChange={(range) => setValue('dateRange', range)}
          onDepartmentChange={(value) => setValue('departmentId', value)}
          onServiceTypeChange={(value) => setValue('serviceType', value)}
        />

        <QuotaFormRight
          amount={watch('amount')}
          walletBalance={wallet?.balance}
          isExceedingBalance={isExceedingBalance}
          onAmountChange={(value) => setValue('amount', value)}
        />
      </div>
      <Toaster />
    </form>
  );
};