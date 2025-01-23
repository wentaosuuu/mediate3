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
import { formatDate, getServiceTypeName } from '@/utils/quotaUtils';
import type { StaffQuota } from '@/types/quota';

export const StaffQuotaHistory = () => {
  const { data: quotaHistory, isLoading } = useQuery({
    queryKey: ['staff-quotas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_quotas')
        .select(`
          *,
          staff:users!staff_id(
            username
          ),
          created_by_user:users!created_by(
            username
          ),
          department_quota:department_quotas!inner(
            service_type,
            department:departments!inner(
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StaffQuota[];
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
            <TableHead>作业员</TableHead>
            <TableHead>所属部门</TableHead>
            <TableHead>服务类型</TableHead>
            <TableHead>额度金额</TableHead>
            <TableHead>剩余金额</TableHead>
            <TableHead>分配人</TableHead>
            <TableHead>创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotaHistory?.map((quota) => (
            <TableRow key={quota.id}>
              <TableCell>{quota.staff?.username}</TableCell>
              <TableCell>{quota.department_quota?.department?.name}</TableCell>
              <TableCell>
                {getServiceTypeName(quota.department_quota?.service_type)}
              </TableCell>
              <TableCell>{quota.quota_amount}</TableCell>
              <TableCell>{quota.remaining_amount}</TableCell>
              <TableCell>{quota.created_by_user?.username}</TableCell>
              <TableCell>{formatDate(quota.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};