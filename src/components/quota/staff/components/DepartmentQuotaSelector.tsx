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

interface DepartmentQuotaSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DepartmentQuotaSelector = ({ value, onValueChange }: DepartmentQuotaSelectorProps) => {
  const { data: quotas, isLoading } = useQuery({
    queryKey: ['department-quotas'],
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

      // 获取部门配额列表
      const { data, error } = await supabase
        .from('department_quotas')
        .select(`
          *,
          department:departments!department_quotas_department_id_fkey (
            name
          )
        `)
        .eq('tenant_id', userDataResponse.data.tenant_id)
        .gt('remaining_amount', 0); // 只获取还有剩余额度的配额

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">选择部门配额</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white border-gray-300">
          <SelectValue placeholder="请选择部门配额" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {quotas?.map((quota) => (
            <SelectItem key={quota.id} value={quota.id} className="hover:bg-gray-100">
              {quota.department?.name} - {quota.service_type} (剩余: {quota.remaining_amount})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};