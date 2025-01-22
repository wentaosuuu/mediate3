import React from 'react';
import { Input } from '@/components/ui/input';

interface QuotaAmountInputProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const QuotaAmountInput = ({ value, onChange }: QuotaAmountInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">额度金额</label>
      <Input
        type="number"
        placeholder="请输入分配额度"
        value={value || ''} // 当值为0时显示空字符串
        onChange={onChange}
        className="w-full bg-white"
      />
    </div>
  );
};