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
  // 使用 React Query 获取配额历史数据
  const { data: quotas, isLoading, error } = useQuery({
    queryKey: ['department-quotas'],
    queryFn: async () => {
      try {
        // 获取当前用户信息
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('未登录');

        // 获取用户的tenant_id
        const { data: userData, error: tenantError } = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', user.id)
          .single();

        if (tenantError) {
          console.error('获取租户信息失败:', tenantError);
          throw tenantError;
        }

        console.log('当前用户tenant_id:', userData.tenant_id); // 添加日志

        // 获取部门配额数据，使用join查询同时获取部门信息
        const { data: quotasData, error: quotasError } = await supabase
          .from('department_quotas')
          .select(`
            *,
            departments:departments(id, name)
          `)
          .eq('tenant_id', userData.tenant_id)
          .order('created_at', { ascending: false });

        if (quotasError) {
          console.error('查询配额错误:', quotasError);
          throw quotasError;
        }

        console.log('获取到的配额数据:', quotasData); // 添加日志

        // 处理数据格式
        const formattedQuotas = quotasData?.map(quota => ({
          ...quota,
          department: quota.departments ? {
            id: quota.departments.id,
            name: quota.departments.name
          } : {
            id: quota.department_id,
            name: '未知部门'
          }
        })) as DepartmentQuota[];

        return formattedQuotas;
      } catch (error) {
        console.error('获取配额历史记录失败:', error);
        throw error;
      }
    },
    refetchInterval: 5000, // 每5秒刷新一次数据
  });

  // 渲染表格
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