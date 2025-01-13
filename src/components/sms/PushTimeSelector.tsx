import React from 'react';
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface PushTimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
}

export const PushTimeSelector = ({ value, onChange }: PushTimeSelectorProps) => {
  return (
    <div className="flex items-start gap-4">
      <span className="w-[116px]">推送时间：</span>
      <div className="flex-1">
        <div className="relative w-[260px]">
          <Input 
            type="datetime-local" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white" 
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        <div className="text-red-500 text-sm mt-1">*发送时间非必填项，设置发送时间则按照发送时间发送</div>
      </div>
    </div>
  );
};