import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ServiceType } from './types';

interface ServiceSelectorProps {
  serviceTypes: ServiceType[];
  selectedServices: Record<string, number>;
  onQuantityChange: (serviceId: string, quantity: string) => void;
}

export const ServiceSelector = ({
  serviceTypes,
  selectedServices,
  onQuantityChange,
}: ServiceSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {serviceTypes.map(service => (
        <Card key={service.id} className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm text-gray-500">
                {service.price} 元/{service.unit}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>购买数量</Label>
            <Input
              type="number"
              min="0"
              value={selectedServices[service.id] || ''}
              onChange={(e) => onQuantityChange(service.id, e.target.value)}
              placeholder={`请输入${service.unit}数`}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};