import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SmsTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export const SmsTemplateSelector = ({ selectedTemplate, onTemplateChange }: SmsTemplateSelectorProps) => {
  return (
    <div className="flex items-start gap-4">
      <span className="text-red-500 mr-1">*</span>
      <span className="w-24">短信模板：</span>
      <div className="flex-1">
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger className="bg-white w-[260px]">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="template1">模板一</SelectItem>
            <SelectItem value="template2">模板二</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};