import React from 'react';
import { Button } from '@/components/ui/button';
import { OrderItem } from './types';

interface OrderSummaryProps {
  items: OrderItem[];
  onSubmit: () => void;
}

export const OrderSummary = ({ items, onSubmit }: OrderSummaryProps) => {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-semibold">总计</span>
        <span className="text-xl font-bold text-primary">
          {total.toFixed(2)} 元
        </span>
      </div>

      <Button 
        className="w-full mt-4" 
        size="lg"
        onClick={onSubmit}
      >
        提交订单
      </Button>
    </div>
  );
};