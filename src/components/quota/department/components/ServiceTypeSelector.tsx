import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceType {
  id: string;
  name: string;
  unit: string;
}

const serviceTypes: ServiceType[] = [
  { id: 'sms', name: '短信服务', unit: '条' },
  { id: 'voice', name: '语音服务', unit: '分钟' },
  { id: 'h5', name: 'H5案件公示', unit: '月' },
];

interface ServiceTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const ServiceTypeSelector = ({ value, onValueChange }: ServiceTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">选择服务类型</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="请选择服务类型" />
        </SelectTrigger>
        <SelectContent>
          {serviceTypes.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};