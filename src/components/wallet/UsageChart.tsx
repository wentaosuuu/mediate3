import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const generateChartData = (selectedServices: string[], timeRange: string, department: string, staff: string) => {
  // 基础数据
  const baseData = {
    '短信服务': { name: '短信服务', 使用量: 400 },
    '彩信服务': { name: '彩信服务', 使用量: 300 },
    '外呼服务': { name: '外呼服务', 使用量: 200 },
    'H5系统': { name: 'H5系统', 使用量: 100 },
    '坐席服务': { name: '坐席服务', 使用量: 150 },
    '号码认证': { name: '号码认证', 使用量: 50 },
  };

  if (selectedServices.includes('all')) {
    return Object.values(baseData);
  }

  return selectedServices.map(service => {
    const serviceKey = serviceTypes.find(s => s.value === service)?.label || '';
    return baseData[serviceKey] || { name: serviceKey, 使用量: 0 };
  });
};

const timeRanges = [
  { value: 'today', label: '本日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'lastMonth', label: '上月' },
  { value: 'custom', label: '自定义' },
];

const serviceTypes = [
  { value: 'all', label: '全部服务' },
  { value: 'sms', label: '短信服务' },
  { value: 'mms', label: '彩信服务' },
  { value: 'voice', label: '外呼服务' },
  { value: 'h5_system', label: 'H5案件公示系统' },
  { value: 'seat', label: '坐席服务' },
  { value: 'number_auth', label: '号码认证' },
];

const departments = [
  { value: 'all', label: '全部部门' },
  { value: 'sales', label: '销售部' },
  { value: 'service', label: '客服部' },
  { value: 'operation', label: '运营部' },
];

const staffMembers = [
  { value: 'all', label: '全部作业员' },
  { value: 'staff1', label: '张三' },
  { value: 'staff2', label: '李四' },
  { value: 'staff3', label: '王五' },
];

export const UsageChart = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [selectedServices, setSelectedServices] = useState(['all']);
  const [department, setDepartment] = useState('all');
  const [staff, setStaff] = useState('all');
  const [chartData, setChartData] = useState([]);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  useEffect(() => {
    const newData = generateChartData(selectedServices, timeRange, department, staff);
    setChartData(newData);
  }, [selectedServices, timeRange, department, staff]);

  const handleServiceChange = (value: string) => {
    let newServices;
    if (value === 'all') {
      newServices = ['all'];
    } else {
      const currentServices = selectedServices.filter(s => s !== 'all');
      if (currentServices.includes(value)) {
        newServices = currentServices.filter(s => s !== value);
      } else {
        newServices = [...currentServices, value];
      }
      if (newServices.length === 0) {
        newServices = ['all'];
      }
    }
    setSelectedServices(newServices);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-medium">额度使用统计</h3>
        <div className="flex flex-wrap gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedServices[0]} 
            onValueChange={handleServiceChange}
            open={isServiceDropdownOpen}
            onOpenChange={(open) => {
              if (!open || open) {
                setIsServiceDropdownOpen(open);
              }
            }}
          >
            <SelectTrigger 
              className="w-[160px] bg-white"
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            >
              <SelectValue placeholder="选择服务类型" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {serviceTypes.map((service) => (
                <SelectItem 
                  key={service.value} 
                  value={service.value}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleServiceChange(service.value);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.value)}
                      onChange={() => {}}
                      className="h-4 w-4"
                    />
                    {service.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="部门" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={staff} onValueChange={setStaff}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="作业员" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {staffMembers.map((member) => (
                <SelectItem key={member.value} value={member.value}>
                  {member.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="使用量" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
