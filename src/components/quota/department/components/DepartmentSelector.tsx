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

interface DepartmentSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DepartmentSelector = ({ value, onValueChange }: DepartmentSelectorProps) => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
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

      // 获取部门列表
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
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
      <label className="block text-sm font-medium text-gray-700 mb-1">选择部门</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white border-gray-300">
          <SelectValue placeholder="请选择部门" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {departments?.map((dept) => (
            <SelectItem key={dept.id} value={dept.id} className="hover:bg-gray-100">
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};