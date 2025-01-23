import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
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
      <label className="text-sm font-medium mb-2 block">选择时间</label>
      <div className="space-y-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="选择时间维度" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="day">按天</SelectItem>
            <SelectItem value="week">按周</SelectItem>
            <SelectItem value="month">按月</SelectItem>
            <SelectItem value="custom">自定义</SelectItem>
          </SelectContent>
        </Select>

        {value === 'custom' && (
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            className="h-10"
          />
        )}
      </div>
    </div>
  );
};