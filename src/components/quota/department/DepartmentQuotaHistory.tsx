import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DepartmentQuota } from '@/types/quota';
import { QuotaHistoryRow } from './QuotaHistoryRow';

export const DepartmentQuotaHistory = () => {
  const { data: quotas, isLoading } = useQuery({
    queryKey: ['department-quotas'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data, error } = await supabase
        .from('department_quotas')
        .select(`
          *,
          department:departments(name)
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as unknown) as DepartmentQuota[];
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">分配历史</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门</TableHead>
            <TableHead>服务类型</TableHead>
            <TableHead>分配金额</TableHead>
            <TableHead>剩余金额</TableHead>
            <TableHead>时间单位</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && quotas?.map((quota) => (
            <QuotaHistoryRow key={quota.id} quota={quota} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};