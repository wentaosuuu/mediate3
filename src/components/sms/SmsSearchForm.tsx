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
import { ChevronDown } from 'lucide-react';

export const SmsSearchForm = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">短信模板内容：</label>
          <Input placeholder="请输入" />
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">短信类型：</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type1">类型一</SelectItem>
              <SelectItem value="type2">类型二</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">发送状态：</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sent">已发送</SelectItem>
              <SelectItem value="pending">待发送</SelectItem>
              <SelectItem value="sending">发送中</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">发送时间：</label>
          <Input type="datetime-local" />
        </div>
        <div className="flex-1 max-w-[200px]">
          <Input type="datetime-local" />
        </div>
        <Button type="submit" className="bg-primary">搜索</Button>
      </div>
    </div>
  );
};