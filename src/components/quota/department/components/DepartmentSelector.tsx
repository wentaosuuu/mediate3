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
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">选择部门</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="请选择部门" />
        </SelectTrigger>
        <SelectContent>
          {departments?.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};