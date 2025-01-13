import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  type: 'input' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  inputType?: string;
  className?: string;
}

export const FormField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder = "请输入", 
  options = [],
  inputType = "text",
  className = "w-[200px]"
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {type === 'input' ? (
        <Input 
          type={inputType}
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white"
        />
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};