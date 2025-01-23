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
}

export const StaffSelector = ({ value, onValueChange }: StaffSelectorProps) => {
  const { data: staffList, isLoading } = useQuery({
    queryKey: ['staff-list'],
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

      // 获取作业员列表
      const { data, error } = await supabase
        .from('users')
        .select('id, username')
        .eq('tenant_id', userDataResponse.data.tenant_id);

      if (error) throw error;
      return data || [];
    },
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