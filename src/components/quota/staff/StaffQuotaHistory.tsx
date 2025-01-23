import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, getServiceTypeName } from '@/utils/quotaUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const StaffQuotaHistory = () => {
  const { data: quotas, isLoading, error } = useQuery({
    queryKey: ['staff-quotas'],
    queryFn: async () => {
      try {
        // 获取当前用户信息
        const userResponse = await supabase.auth.getUser();
        if (userResponse.error) throw userResponse.error;
        if (!userResponse.data.user) throw new Error('未登录');

        // 获取用户的tenant_id
        const userDataResponse = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', userResponse.data.user.id)
          .single();

        if (userDataResponse.error) throw userDataResponse.error;

        // 获取作业员配额数据
        const { data: quotasData, error: quotasError } = await supabase
          .from('staff_quotas')
          .select(`
            id,
            tenant_id,
            department_quota_id,
            staff_id,
            quota_amount,
            remaining_amount,
            created_at,
            created_by,
            updated_at,
            staff:users!staff_quotas_staff_id_fkey (
              username
            ),
            created_by_user:users!staff_quotas_created_by_fkey (
              username
            ),
            department_quotas:department_quotas!staff_quotas_department_quota_id_fkey (
              service_type,
              department:departments (
                name
              )
            )
          `)
          .eq('tenant_id', userDataResponse.data.tenant_id)
          .order('created_at', { ascending: false });

        if (quotasError) throw quotasError;

        return quotasData || [];
      } catch (error) {
        console.error('获取配额历史记录失败:', error);
        throw error;
      }
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">分配历史</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>作业员</TableHead>
            <TableHead>部门</TableHead>
            <TableHead>服务类型</TableHead>
            <TableHead>分配额度</TableHead>
            <TableHead>剩余额度</TableHead>
            <TableHead>分配者</TableHead>
            <TableHead>分配时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">加载中...</TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-red-500">
                加载失败，请刷新重试
              </TableCell>
            </TableRow>
          ) : quotas && quotas.length > 0 ? (
            quotas.map((quota) => (
              <TableRow key={quota.id}>
                <TableCell>{quota.staff?.username}</TableCell>
                <TableCell>{quota.department_quotas?.department?.name}</TableCell>
                <TableCell>{getServiceTypeName(quota.department_quotas?.service_type)}</TableCell>
                <TableCell>{quota.quota_amount}</TableCell>
                <TableCell>{quota.remaining_amount}</TableCell>
                <TableCell>{quota.created_by_user?.username}</TableCell>
                <TableCell>{formatDate(quota.created_at)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">暂无数据</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};