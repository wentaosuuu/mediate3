import React from 'react';

interface SmsStatsProps {
  phoneNumbers: string;
}

export const SmsStats = ({ phoneNumbers }: SmsStatsProps) => {
  const count = phoneNumbers.split(',').filter(n => n.trim()).length;
  
  return (
    <div className="text-center text-gray-500">
      共{count}个手机号码，{count}个号码一条短信
    </div>
  );
};