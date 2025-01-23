import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, getServiceTypeName } from '@/utils/quotaUtils';

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
          .maybeSingle();

        if (userDataResponse.error || !userDataResponse.data) {
          throw new Error('获取租户信息失败');
        }

        // 获取作业员配额数据
        const { data: quotasData, error: quotasError } = await supabase
          .from('staff_quotas')
          .select(`
            *,
            staff:staff_id(username),
            created_by_user:created_by(username),
            department_quota:department_quotas(
              service_type,
              department:departments(name)
            )
          `)
          .eq('tenant_id', userDataResponse.data.tenant_id)
          .order('created_at', { ascending: false });

        if (quotasError) {
          console.error('获取配额数据失败:', quotasError);
          throw quotasError;
        }

        return quotasData || [];
      } catch (error) {
        console.error('获取配额历史记录失败:', error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>加载失败: {error instanceof Error ? error.message : '未知错误'}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">作业员</th>
            <th className="px-6 py-3">部门</th>
            <th className="px-6 py-3">服务类型</th>
            <th className="px-6 py-3">分配额度</th>
            <th className="px-6 py-3">剩余额度</th>
            <th className="px-6 py-3">分配者</th>
            <th className="px-6 py-3">分配时间</th>
          </tr>
        </thead>
        <tbody>
          {quotas?.map((quota) => (
            <tr key={quota.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{quota.staff?.username}</td>
              <td className="px-6 py-4">{quota.department_quota?.department?.name}</td>
              <td className="px-6 py-4">{getServiceTypeName(quota.department_quota?.service_type)}</td>
              <td className="px-6 py-4">{quota.quota_amount}</td>
              <td className="px-6 py-4">{quota.remaining_amount}</td>
              <td className="px-6 py-4">{quota.created_by_user?.username}</td>
              <td className="px-6 py-4">{formatDate(quota.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};