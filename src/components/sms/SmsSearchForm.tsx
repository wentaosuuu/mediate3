import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
            <option value="">请选择</option>
          </Select>
        </div>
        <div className="flex-1 max-w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">发送状态：</label>
          <Select>
            <option value="">请输入</option>
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