import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { OrderItem } from '@/pages/quota/Purchase';

interface OrderListProps {
  items: OrderItem[];
  serviceTypes: {
    value: string;
    label: string;
    unit: string;
  }[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

export const OrderList = ({ 
  items, 
  serviceTypes,
  onRemoveItem,
  onUpdateQuantity 
}: OrderListProps) => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleQuantityChange = (index: number, value: string) => {
    const quantity = parseInt(value.replace(/[^0-9]/g, ''));
    if (quantity > 0) {
      onUpdateQuantity(index, quantity);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          暂无服务项目
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* 订单项列表 */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const serviceType = serviceTypes.find(s => s.value === item.serviceType);
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="font-medium truncate">
                    {serviceType?.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    ¥{item.unitPrice.toFixed(2)}/{serviceType?.unit}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-24"
                  />
                  <div className="text-right min-w-[100px]">
                    <div className="font-medium">
                      ¥{item.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.quantity}{serviceType?.unit}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 总价 */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">总计</span>
            <span className="text-xl font-bold text-primary">
              ¥{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};