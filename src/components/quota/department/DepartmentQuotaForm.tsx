import React from 'react';
import { useForm } from 'react-hook-form';
import { QuotaFormLeft } from './components/QuotaFormLeft';
import { QuotaFormRight } from './components/QuotaFormRight';
import { Toaster } from '@/components/ui/toaster';
import { useWalletBalance } from '@/hooks/use-wallet-balance';
import { useQuotaFormSubmit } from '@/hooks/use-quota-form-submit';
import type { DepartmentQuotaFormData } from '@/types/quota';

export const DepartmentQuotaForm = () => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<DepartmentQuotaFormData>({
    defaultValues: {
      timeUnit: 'day',
      departmentId: '',
      amount: undefined,
      dateRange: undefined,
    },
  });

  const { data: wallet } = useWalletBalance();
  const { handleSubmit: submitQuota } = useQuotaFormSubmit();

  const amount = watch('amount');
  const isExceedingBalance = wallet && amount > wallet.balance;

  const onSubmit = async (data: DepartmentQuotaFormData) => {
    const success = await submitQuota(data, wallet?.balance);
    if (success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuotaFormLeft
          timeUnit={watch('timeUnit')}
          dateRange={watch('dateRange')}
          departmentId={watch('departmentId')}
          onTimeUnitChange={(value) => setValue('timeUnit', value)}
          onDateRangeChange={(range) => setValue('dateRange', range)}
          onDepartmentChange={(value) => setValue('departmentId', value)}
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