import React from 'react';
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
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface UsageData {
  id: string;
  amount: number;
  service_type: string;
  created_at: string;
  staff: { username: string } | null;
  staff_quota: {
    department_quota: {
      department: { name: string } | null;
    } | null;
  } | null;
}

interface UsageChartProps {
  data: UsageData[];
}

export const UsageChart = ({ data }: UsageChartProps) => {
  // 处理数据以按日期分组
  const processedData = data.reduce((acc: any[], curr) => {
    const date = format(new Date(curr.created_at), 'MM-dd', { locale: zhCN });
    const existingDate = acc.find(item => item.date === date);

    if (existingDate) {
      existingDate.amount += curr.amount;
    } else {
      acc.push({
        date,
        amount: curr.amount,
      });
    }

    return acc;
  }, []);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" name="使用额度" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};