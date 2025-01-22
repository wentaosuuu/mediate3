import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const DepartmentQuotaHistory = () => {
  // 获取历史记录
  const { data: history, isLoading } = useQuery({
    queryKey: ['department-quotas-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_quotas')
        .select(`
          *,
          departments (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">分配历史</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门</TableHead>
            <TableHead>时间维度</TableHead>
            <TableHead>额度</TableHead>
            <TableHead>剩余额度</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.departments?.name}</TableCell>
              <TableCell>
                {record.time_unit === 'day' ? '按天' : 
                 record.time_unit === 'week' ? '按周' : '按月'}
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