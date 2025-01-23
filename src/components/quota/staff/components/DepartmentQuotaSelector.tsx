import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface DepartmentQuotaSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  serviceType: string;
}

export const DepartmentQuotaSelector = ({ value, onValueChange, serviceType }: DepartmentQuotaSelectorProps) => {
  const { data: quotas, isLoading } = useQuery({
    queryKey: ['department-quotas', serviceType],
    queryFn: async () => {
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

      // 构建查询条件
      let query = supabase
        .from('department_quotas')
        .select(`
          *,
          department:departments (
            name
          )
        `)
        .eq('tenant_id', userDataResponse.data.tenant_id)
        .gt('remaining_amount', 0);

      // 如果选择了具体的服务类型，则添加筛选条件
      if (serviceType !== 'all') {
        query = query.eq('service_type', serviceType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  // 获取当前选中的配额信息
  const selectedQuota = quotas?.find(quota => quota.id === value);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">选择部门配额</label>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full bg-white border-gray-300">
            <SelectValue placeholder="请选择部门配额" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {quotas?.map((quota) => (
              <SelectItem key={quota.id} value={quota.id} className="hover:bg-gray-100">
                {quota.department?.name} - {quota.service_type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 显示选中部门的可分配额度信息 */}
      {selectedQuota && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-sm text-blue-800">
              <div className="flex justify-between mb-2">
                <span>部门总额度：</span>
                <span className="font-semibold">{selectedQuota.quota_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>可分配额度：</span>
                <span className="font-semibold text-green-600">{selectedQuota.remaining_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};