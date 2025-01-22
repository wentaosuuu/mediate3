import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuotaAmountInput } from './QuotaAmountInput';

interface QuotaFormRightProps {
  amount: number;
  walletBalance?: number;
  isExceedingBalance: boolean;
  onAmountChange: (value: number) => void;
}

export const QuotaFormRight = ({
  amount,
  walletBalance,
  isExceedingBalance,
  onAmountChange,
}: QuotaFormRightProps) => {
  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <QuotaAmountInput
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
        />
        
        {isExceedingBalance && (
          <div className="text-red-500 text-sm">
            输入金额超出当前钱包余额
          </div>
        )}

        {walletBalance !== undefined && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">当前钱包余额</span>
              <span className="text-2xl font-semibold text-blue-800">
                {walletBalance} 元
              </span>
            </div>
          </Card>
        )}
      </div>

      <Button type="submit" className="w-full h-11">
        确认分配
      </Button>
    </div>
  );
};