import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SmsRecordsSearchForm = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">短信内容：</label>
          <Input placeholder="请输入" />
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">客户姓名/手机号：</label>
          <Input placeholder="请输入" />
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">短信类型：</label>
          <Select>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="type1">类型一</SelectItem>
              <SelectItem value="type2">类型二</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">发送状态：</label>
          <Select>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="success">发送成功</SelectItem>
              <SelectItem value="failed">发送失败</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">发送时间：</label>
          <Input 
            type="datetime-local" 
            className="bg-white [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
        <div className="flex-1 max-w-[200px]">
          <Input 
            type="datetime-local"
            className="bg-white [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
        <Button type="submit" className="bg-primary">搜索</Button>
      </div>
    </div>
  );
};