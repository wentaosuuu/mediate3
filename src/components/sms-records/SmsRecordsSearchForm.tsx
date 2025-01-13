import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { TimeRangeField } from './TimeRangeField';
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

  // 短信类型选项
  const smsTypeOptions = [
    { value: 'notice', label: '通知类' },
    { value: 'marketing', label: '营销类' },
    { value: 'verification', label: '验证码' },
  ];

  // 发送状态选项
  const statusOptions = [
    { value: 'success', label: '发送成功' },
    { value: 'failed', label: '发送失败' },
    { value: 'pending', label: '待发送' },
  ];

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
      <div className="flex flex-wrap gap-4">
        <FormField
          label="短信内容"
          type="input"
          value={content}
          onChange={setContent}
        />
        <FormField
          label="客户姓名/手机号"
          type="input"
          value={customerInfo}
          onChange={setCustomerInfo}
        />
        <FormField
          label="短信类型"
          type="select"
          value={smsType}
          onChange={setSmsType}
          options={smsTypeOptions}
        />
        <FormField
          label="发送状态"
          type="select"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
        <TimeRangeField
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
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