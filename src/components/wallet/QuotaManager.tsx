import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { QuotaUsageChart } from './QuotaUsageChart';

// 服务类型定义
const serviceTypes = [
  { id: 'sms', name: '短信服务', quota: 1000, unit: '条' },
  { id: 'mms', name: '彩信服务', quota: 500, unit: '条' },
  { id: 'voice', name: '外呼服务', quota: 300, unit: '分钟' },
  { id: 'h5_system', name: 'H5案件公示系统', quota: 2, unit: '月' },
  { id: 'seat', name: '坐席服务', quota: 5, unit: '月/坐席' },
  { id: 'number_auth', name: '号码认证', quota: 3, unit: '年/个' },
];

export const QuotaManager = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">额度监测</h2>
          <Button 
            onClick={() => navigate('/wallet/purchase')}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            购买额度
          </Button>
        </div>

        {/* 统计图表 */}
        <QuotaUsageChart />

        {/* 剩余额度展示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceTypes.map(service => (
            <Card key={service.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">
                    剩余: {service.quota} {service.unit}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: '70%' }}
                ></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};