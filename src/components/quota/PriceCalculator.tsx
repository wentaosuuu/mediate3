import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrderItem } from '@/pages/quota/Purchase';

interface ServiceType {
  value: string;
  label: string;
  price: number;
  unit: string;
}

interface PriceCalculatorProps {
  serviceTypes: ServiceType[];
  onAddItem: (item: OrderItem) => void;
}

export const PriceCalculator = ({ serviceTypes, onAddItem }: PriceCalculatorProps) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setQuantity('');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setQuantity(value);
  };

  const handleAddToOrder = () => {
    const service = serviceTypes.find(s => s.value === selectedService);
    if (!service || !quantity || parseInt(quantity) <= 0) return;

    const quantityNum = parseInt(quantity);
    onAddItem({
      serviceType: service.value,
      quantity: quantityNum,
      unitPrice: service.price,
      totalPrice: quantityNum * service.price
    });

    // 重置表单
    setQuantity('');
  };

  const selectedServiceType = serviceTypes.find(s => s.value === selectedService);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 服务选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">选择服务</label>
          <Select value={selectedService} onValueChange={handleServiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="请选择服务类型" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((service) => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 数量输入 */}
        {selectedService && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              购买数量 ({selectedServiceType?.unit})
            </label>
            <Input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder={`请输入${selectedServiceType?.unit}数`}
            />
          </div>
        )}

        {/* 价格显示 */}
        {selectedService && quantity && parseInt(quantity) > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>单价</span>
              <span>¥{selectedServiceType?.price.toFixed(2)}/{selectedServiceType?.unit}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span>总价</span>
              <span className="text-primary">
                ¥{(selectedServiceType?.price * parseInt(quantity)).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* 添加按钮 */}
        <Button
          className="w-full"
          disabled={!selectedService || !quantity || parseInt(quantity) <= 0}
          onClick={handleAddToOrder}
        >
          添加到订单
        </Button>
      </div>
    </Card>
  );
};