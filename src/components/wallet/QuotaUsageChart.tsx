import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { addDays } from 'date-fns';
import { DateRange } from "react-day-picker";

// 模拟数据 - 实际项目中应该从后端获取
const mockData = [
  { name: '短信服务', 使用量: 400 },
  { name: '彩信服务', 使用量: 300 },
  { name: '外呼服务', 使用量: 200 },
  { name: 'H5案件公示系统', 使用量: 1 },
  { name: '坐席服务', 使用量: 3 },
];

// 部门数据
const departments = [
  { value: 'all', label: '全部部门' },
  { value: 'tech', label: '技术部' },
  { value: 'operation', label: '运营部' },
  { value: 'customer', label: '客服部' },
];

// 作业员数据
const operators = [
  { value: 'all', label: '全部作业员' },
  { value: 'op1', label: '张三' },
  { value: 'op2', label: '李四' },
  { value: 'op3', label: '王五' },
];

// 时间维度选项
const timeRanges = [
  { value: 'today', label: '本日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'lastMonth', label: '上月' },
  { value: 'custom', label: '自定义' },
];

export const QuotaUsageChart = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [department, setDepartment] = useState('all');
  const [operator, setOperator] = useState('all');
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <Card className="p-6">
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">额度使用统计</h3>
        
        <div className="flex flex-wrap gap-4">
          {/* 时间维度选择器 */}
          <div className="w-48">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="选择时间维度" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 自定义日期范围选择器 */}
          {timeRange === 'custom' && (
            <div className="w-[300px]">
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
          )}

          {/* 部门选择器 */}
          <div className="w-48">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 作业员选择器 */}
          <div className="w-48">
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="选择作业员" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 图表展示区域 - 限制高度并保持响应式 */}
      <div className="h-[240px] w-full">
        <ChartContainer
          config={{
            使用量: { color: '#409EFF' },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="使用量" fill="#409EFF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};