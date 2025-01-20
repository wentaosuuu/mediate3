import React from 'react';
import { Button } from '@/components/ui/button';
import { OrderItem } from './types';

interface OrderItemListProps {
  items: OrderItem[];
  onRemoveItem: (index: number) => void;
}

export const OrderItemList = ({ items, onRemoveItem }: OrderItemListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">{item.serviceType}</p>
            <p className="text-sm text-gray-500">
              {item.quantity} × {item.unitPrice} 元
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">{item.totalPrice.toFixed(2)} 元</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(index)}
            >
              删除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};