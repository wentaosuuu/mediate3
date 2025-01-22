import React from 'react';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeUnitSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TimeUnitSelector = ({ value, onValueChange }: TimeUnitSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <Calendar className="h-5 w-5 text-gray-500" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="选择时间维度" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="day">按天</SelectItem>
          <SelectItem value="week">按周</SelectItem>
          <SelectItem value="month">按月</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};