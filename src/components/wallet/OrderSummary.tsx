import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { OrderItem } from './types';

interface OrderSummaryProps {
  items: OrderItem[];
  onSubmit: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isSubmitting?: boolean;
}

export const OrderSummary = ({ items, onSubmit, isOpen, onToggle, isSubmitting = false }: OrderSummaryProps) => {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Card className="fixed bottom-0 left-64 right-0 p-4 bg-white shadow-lg border-t">
      <Collapsible open={isOpen}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger onClick={onToggle}>
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              <span className="ml-2">费用明细</span>
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">
              总计: <span className="font-bold text-primary">{total.toFixed(2)} 元</span>
            </span>
            <Button 
              onClick={onSubmit} 
              disabled={items.length === 0 || isSubmitting}
            >
              {isSubmitting ? "提交中..." : "提交订单"}
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="mt-4 space-y-2">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-2">
                暂无选购服务
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-t">
                  <span>{item.serviceType}</span>
                  <span className="text-gray-600">
                    {item.quantity} × {item.unitPrice} = {item.totalPrice.toFixed(2)} 元
                  </span>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};