import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// 模拟数据
const data = [
  { name: '短信服务', 使用量: 400 },
  { name: '彩信服务', 使用量: 300 },
  { name: '外呼服务', 使用量: 200 },
  { name: 'H5系统', 使用量: 100 },
  { name: '坐席服务', 使用量: 150 },
  { name: '号码认证', 使用量: 50 },
];

const timeRanges = [
  { value: 'today', label: '本日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'lastMonth', label: '上月' },
  { value: 'custom', label: '自定义' },
];

const departments = [
  { value: 'all', label: '全部部门' },
  { value: 'sales', label: '销售部' },
  { value: 'service', label: '客服部' },
  { value: 'operation', label: '运营部' },
];

export const UsageChart = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [department, setDepartment] = useState('all');
  const [viewType, setViewType] = useState('department'); // department | staff

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

          <Tabs value={viewType} onValueChange={setViewType} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="department">部门</TabsTrigger>
              <TabsTrigger value="staff">作业员</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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