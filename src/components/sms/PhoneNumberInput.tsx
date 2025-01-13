import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PhoneNumberInputProps {
  phoneNumbers: string;
  onPhoneNumbersChange: (numbers: string) => void;
}

export const PhoneNumberInput = ({ phoneNumbers, onPhoneNumbersChange }: PhoneNumberInputProps) => {
  return (
    <div className="flex items-start gap-4">
      <span className="text-red-500 mr-1">*</span>
      <span className="w-24">发送用户及发送数据：</span>
      <div className="flex-1 flex gap-2">
        <Input 
          placeholder="请输入手机号码，多个号码用逗号分隔" 
          value={phoneNumbers}
          onChange={(e) => onPhoneNumbersChange(e.target.value)}
          className="bg-white flex-1"
        />
        <Button variant="outline" className="bg-white whitespace-nowrap">
          导入发送用户
        </Button>
      </div>
    </div>
  );
};