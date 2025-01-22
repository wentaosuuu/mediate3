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
  // 模拟测试数据
  const testDepartments = [
    { id: '1', name: '调解一部' },
    { id: '2', name: '调解二部' },
    { id: '3', name: '调解三部' },
  ];

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      // 在实际环境中使用这段代码
      // const { data, error } = await supabase
      //   .from('departments')
      //   .select('id, name');
      
      // if (error) throw error;
      // return data;
      
      // 使用测试数据
      return testDepartments;
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