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
import type { SmsSearchParams } from '@/types/sms';

interface SmsRecordsSearchFormProps {
  onSearch: (params: SmsSearchParams) => void;
}

export const SmsRecordsSearchForm = ({ onSearch }: SmsRecordsSearchFormProps) => {
  const [content, setContent] = React.useState('');
  const [customerInfo, setCustomerInfo] = React.useState('');
  const [smsType, setSmsType] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');

  const handleSearch = () => {
    onSearch({
      content,
      customerInfo,
      smsType,
      status,
      startTime,
      endTime
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      {/* 修改为 flex-wrap，让内容可以自动换行 */}
      <div className="flex flex-wrap gap-4">
        <div className="w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">短信内容：</label>
          <Input 
            placeholder="请输入" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">客户姓名/手机号：</label>
          <Input 
            placeholder="请输入" 
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">短信类型：</label>
          <Select value={smsType} onValueChange={setSmsType}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notice">通知类</SelectItem>
              <SelectItem value="marketing">营销类</SelectItem>
              <SelectItem value="verification">验证码</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <label className="block text-sm text-gray-600 mb-1">发送状态：</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">发送成功</SelectItem>
              <SelectItem value="failed">发送失败</SelectItem>
              <SelectItem value="pending">待发送</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[420px]">
          <label className="block text-sm text-gray-600 mb-1">发送时间：</label>
          <div className="flex gap-2">
            <Input 
              type="datetime-local" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-white w-[200px]"
            />
            <Input 
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-white w-[200px]"
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button 
            type="button" 
            className="bg-primary"
            onClick={handleSearch}
          >
            搜索
          </Button>
        </div>
      </div>
    </div>
  );
};