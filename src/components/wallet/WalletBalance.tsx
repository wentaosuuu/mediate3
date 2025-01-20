import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WalletBalanceProps {
  balance: number;
  isLoading: boolean;
}

export const WalletBalance = ({ balance, isLoading }: WalletBalanceProps) => {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">当前余额</h3>
        {isLoading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <div className="text-3xl font-semibold">{formatBalance(balance)}</div>
        )}
      </div>
    </Card>
  );
};