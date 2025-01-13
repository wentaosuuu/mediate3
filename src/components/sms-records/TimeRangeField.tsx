import React from 'react';
import { Input } from '@/components/ui/input';

interface TimeRangeFieldProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export const TimeRangeField = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange
}: TimeRangeFieldProps) => {
  return (
    <div className="w-[420px]">
      <label className="block text-sm text-gray-600 mb-1">发送时间：</label>
      <div className="flex gap-2">
        <Input 
          type="datetime-local" 
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className="bg-white w-[200px]"
        />
        <Input 
          type="datetime-local"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          className="bg-white w-[200px]"
        />
      </div>
    </div>
  );
};