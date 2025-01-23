import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuotaAmountInput } from './QuotaAmountInput';

interface QuotaFormRightProps {
  amount: number;
  onAmountChange: (value: number) => void;
}

export const QuotaFormRight = ({
  amount,
  onAmountChange,
}: QuotaFormRightProps) => {
  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
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