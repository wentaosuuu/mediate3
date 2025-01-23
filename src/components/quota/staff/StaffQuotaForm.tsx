import React from 'react';
import { useForm } from 'react-hook-form';
import { QuotaFormLeft } from './components/QuotaFormLeft';
import { QuotaFormRight } from './components/QuotaFormRight';
import { Toaster } from '@/components/ui/toaster';
import { useStaffQuotaFormSubmit } from '@/hooks/use-staff-quota-form-submit';
import type { StaffQuotaFormData } from '@/types/quota';

export const StaffQuotaForm = () => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<StaffQuotaFormData>({
    defaultValues: {
      departmentQuotaId: '',
      staffId: '',
      serviceType: 'all',
      amount: undefined,
    },
  });

  const { handleSubmit: submitQuota } = useStaffQuotaFormSubmit();

  const onSubmit = async (data: StaffQuotaFormData) => {
    const success = await submitQuota(data);
    if (success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuotaFormLeft
          departmentQuotaId={watch('departmentQuotaId')}
          staffId={watch('staffId')}
          serviceType={watch('serviceType')}
          onDepartmentQuotaChange={(value) => setValue('departmentQuotaId', value)}
          onStaffChange={(value) => setValue('staffId', value)}
          onServiceTypeChange={(value) => setValue('serviceType', value)}
        />

        <QuotaFormRight
          amount={watch('amount')}
          onAmountChange={(value) => setValue('amount', value)}
        />
      </div>
      <Toaster />
    </form>
  );
};