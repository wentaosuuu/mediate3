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
} from "@/components/ui/table";
import { getTimeUnitName, formatDate, getServiceTypeName } from '@/utils/quotaUtils';
import type { DepartmentQuota } from '@/types/quota';

export const DepartmentQuotaHistory = () => {
  const { data: quotaHistory, isLoading } = useQuery({
    queryKey: ['department-quotas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_quotas')
        .select(`
          *,
          department:departments!inner(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DepartmentQuota[];
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
            <TableHead>服务类型</TableHead>
            <TableHead>时间维度</TableHead>
            <TableHead>额度金额</TableHead>
            <TableHead>剩余金额</TableHead>
            <TableHead>生效时间</TableHead>
            <TableHead>失效时间</TableHead>
            <TableHead>创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotaHistory?.map((quota) => (
            <TableRow key={quota.id}>
              <TableCell>{quota.department?.name}</TableCell>
              <TableCell>{getServiceTypeName(quota.service_type)}</TableCell>
              <TableCell>{getTimeUnitName(quota.time_unit)}</TableCell>
              <TableCell>{quota.quota_amount}</TableCell>
              <TableCell>{quota.remaining_amount}</TableCell>
              <TableCell>{formatDate(quota.start_date)}</TableCell>
              <TableCell>{formatDate(quota.end_date)}</TableCell>
              <TableCell>{formatDate(quota.created_at || '')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};