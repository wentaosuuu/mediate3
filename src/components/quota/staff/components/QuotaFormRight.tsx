import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuotaAmountInput } from './QuotaAmountInput';
import { supabase } from '@/integrations/supabase/client';

interface QuotaFormRightProps {
  amount: number;
  onAmountChange: (value: number) => void;
}

export const QuotaFormRight = ({
  amount,
  onAmountChange,
}: QuotaFormRightProps) => {
  // 获取团队长的可分配额度
  const { data: managerQuota } = useQuery({
    queryKey: ['manager-quota'],
    queryFn: async () => {
      try {
        // 获取当前用户信息
        const userResponse = await supabase.auth.getUser();
        if (userResponse.error) throw userResponse.error;
        if (!userResponse.data.user) throw new Error('未登录');

        // 获取用户的tenant_id
        const userDataResponse = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', userResponse.data.user.id)
          .single();

        if (userDataResponse.error) throw userDataResponse.error;

        // 获取团队长的配额总和
        const { data: quotaData, error: quotaError } = await supabase
          .from('staff_quotas')
          .select('remaining_amount')
          .eq('tenant_id', userDataResponse.data.tenant_id)
          .eq('staff_id', userResponse.data.user.id);

        if (quotaError) throw quotaError;

        // 计算总可分配额度
        const totalQuota = quotaData?.reduce((sum, quota) => sum + (quota.remaining_amount || 0), 0) || 0;

        return totalQuota;
      } catch (error) {
        console.error('获取团队长配额失败:', error);
        return 0;
      }
    },
  });

  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* 显示团队长可分配额度 */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">当前可分配总额度</span>
            <span className="text-2xl font-semibold text-blue-800">
              {managerQuota || 0} 元
            </span>
          </div>
        </Card>

        <QuotaAmountInput
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
        />
      </div>

      <Button type="submit" className="w-full h-11">
        确认分配
      </Button>
    </div>
  );
};