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
  const { data: quotas, isLoading, error } = useQuery({
    queryKey: ['department-quotas'],
    queryFn: async () => {
      try {
        // 获取当前用户信息
        const userResponse = await supabase.auth.getUser();
        if (!userResponse.data.user) {
          throw new Error('未登录');
        }

        // 获取用户的tenant_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', userResponse.data.user.id)
          .single();

        if (userError || !userData) {
          throw new Error('获取租户信息失败');
        }

        // 获取部门配额数据
        const { data: quotasData, error: quotasError } = await supabase
          .from('department_quotas')
          .select(`
            *,
            departments!department_quotas_department_id_fkey (
              id,
              name
            )
          `)
          .eq('tenant_id', userData.tenant_id)
          .order('created_at', { ascending: false });

        if (quotasError) {
          console.error('获取配额数据失败:', quotasError);
          throw quotasError;
        }

        // 转换数据格式以匹配 DepartmentQuota 类型
        const formattedQuotas = quotasData?.map(quota => ({
          ...quota,
          department: quota.departments
        }));

        return formattedQuotas || [];
      } catch (error) {
        console.error('获取配额历史记录失败:', error);
        throw error;
      }
    },
    refetchInterval: 5000,
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
          {isLoading ? (
            <TableRow>
              <td colSpan={7} className="text-center py-4">加载中...</td>
            </TableRow>
          ) : error ? (
            <TableRow>
              <td colSpan={7} className="text-center py-4 text-red-500">
                加载失败，请刷新重试
              </td>
            </TableRow>
          ) : quotas && quotas.length > 0 ? (
            quotas.map((quota) => (
              <QuotaHistoryRow key={quota.id} quota={quota} />
            ))
          ) : (
            <TableRow>
              <td colSpan={7} className="text-center py-4">暂无数据</td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};