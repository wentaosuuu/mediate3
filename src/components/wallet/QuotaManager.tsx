import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { UsageChart } from './UsageChart';

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
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">额度使用监测</h2>
        <Button 
          onClick={() => navigate('/wallet/purchase')}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          购买额度
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceTypes.map(service => (
          <Card key={service.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  剩余：<span className="text-primary font-medium">{service.quota}</span> {service.unit}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <UsageChart />
    </div>
  );
};