import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export interface ServiceType {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface ServiceSelectorProps {
  selectedService: string;
  quantity: string;
  serviceTypes: ServiceType[];
  onServiceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
}

export const ServiceSelector = ({
  selectedService,
  quantity,
  serviceTypes,
  onServiceChange,
  onQuantityChange,
}: ServiceSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <Label>服务类型</Label>
        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="请选择服务类型" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map(service => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} ({service.price}元/{service.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>购买数量</Label>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder="请输入数量"
        />
      </div>
    </div>
  );
};