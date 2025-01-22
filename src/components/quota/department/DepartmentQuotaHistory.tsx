import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const DepartmentQuotaHistory = () => {
  // 获取历史记录数据
  const { data: quotaHistory, isLoading } = useQuery({
    queryKey: ['departmentQuotaHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_quotas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门</TableHead>
            <TableHead>时间维度</TableHead>
            <TableHead>分配额度</TableHead>
            <TableHead>剩余额度</TableHead>
            <TableHead>生效时间</TableHead>
            <TableHead>失效时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotaHistory?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.department_id}</TableCell>
              <TableCell>
                {record.time_unit === 'day' && '按天'}
                {record.time_unit === 'week' && '按周'}
                {record.time_unit === 'month' && '按月'}
              </TableCell>
              <TableCell>{record.quota_amount}</TableCell>
              <TableCell>{record.remaining_amount}</TableCell>
              <TableCell>{new Date(record.start_date).toLocaleString()}</TableCell>
              <TableCell>{new Date(record.end_date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};