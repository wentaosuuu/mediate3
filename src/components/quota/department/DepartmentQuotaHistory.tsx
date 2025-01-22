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
      // 获取当前用户信息
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      // 获取用户的tenant_id
      const { data: userData, error: tenantError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (tenantError || !userData) {
        throw new Error('获取租户信息失败');
      }

      // 先获取部门配额数据
      const { data: quotasData, error: quotasError } = await supabase
        .from('department_quotas')
        .select('*')
        .eq('tenant_id', userData.tenant_id)
        .order('created_at', { ascending: false });

      if (quotasError) {
        console.error('查询配额错误:', quotasError);
        throw quotasError;
      }

      // 如果有配额数据，获取对应的部门信息
      if (quotasData && quotasData.length > 0) {
        const departmentIds = quotasData.map(quota => quota.department_id);
        const { data: departmentsData, error: departmentsError } = await supabase
          .from('departments')
          .select('id, name')
          .in('id', departmentIds);

        if (departmentsError) {
          console.error('查询部门错误:', departmentsError);
          throw departmentsError;
        }

        // 将部门信息合并到配额数据中
        const quotasWithDepartments = quotasData.map(quota => ({
          ...quota,
          department: departmentsData?.find(dept => dept.id === quota.department_id) || null
        }));

        return quotasWithDepartments as DepartmentQuota[];
      }

      return [];
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