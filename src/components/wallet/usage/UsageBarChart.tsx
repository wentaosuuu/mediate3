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

interface ChartData {
  name: string;
  使用量: number;
}

interface UsageBarChartProps {
  data: ChartData[];
}

export const UsageBarChart: React.FC<UsageBarChartProps> = ({ data }) => {
  return (
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
  );
};