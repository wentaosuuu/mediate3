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

interface StaffSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  departmentId?: string;
}

export const StaffSelector = ({ value, onValueChange, departmentId }: StaffSelectorProps) => {
  const { data: staffList, isLoading } = useQuery({
    queryKey: ['staff', departmentId],
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

      // 获取员工列表
      let query = supabase
        .from('users')
        .select('id, username')
        .eq('tenant_id', userDataResponse.data.tenant_id);

      if (departmentId) {
        // 如果指定了部门，则只获取该部门的员工
        const staffQuotasResponse = await supabase
          .from('staff_quotas')
          .select('staff_id')
          .eq('department_quota_id', departmentId);

        if (staffQuotasResponse.error) throw staffQuotasResponse.error;
        
        const staffIds = staffQuotasResponse.data.map(sq => sq.staff_id);
        if (staffIds.length > 0) {
          query = query.in('id', staffIds);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !departmentId || departmentId.length > 0,
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">选择作业员</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white border-gray-300">
          <SelectValue placeholder="请选择作业员" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {staffList?.map((staff) => (
            <SelectItem key={staff.id} value={staff.id} className="hover:bg-gray-100">
              {staff.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};