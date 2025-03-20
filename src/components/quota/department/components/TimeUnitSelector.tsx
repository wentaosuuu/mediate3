
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from '@/types/case'; // 从我们自己的类型定义中导入
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface TimeUnitSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export const TimeUnitSelector = ({
  value,
  onValueChange,
  dateRange,
  onDateRangeChange,
}: TimeUnitSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">选择时间</label>
      <div className="space-y-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full bg-white border-gray-300">
            <SelectValue placeholder="请选择时间维度" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="day" className="hover:bg-gray-100">按天</SelectItem>
            <SelectItem value="week" className="hover:bg-gray-100">按周</SelectItem>
            <SelectItem value="month" className="hover:bg-gray-100">按月</SelectItem>
            <SelectItem value="custom" className="hover:bg-gray-100">自定义</SelectItem>
          </SelectContent>
        </Select>

        {value === 'custom' && (
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            className="w-full bg-white border border-gray-300 rounded-md"
          />
        )}
      </div>
    </div>
  );
};
