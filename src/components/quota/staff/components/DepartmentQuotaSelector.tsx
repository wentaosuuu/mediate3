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
import { getServiceTypeName } from '@/utils/quotaUtils';

interface DepartmentQuotaSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  departmentId?: string;
}

export const DepartmentQuotaSelector = ({
  value,
  onValueChange,
  departmentId,
}: DepartmentQuotaSelectorProps) => {
  const { data: departmentQuotas, isLoading } = useQuery({
    queryKey: ['department-quotas', departmentId],
    queryFn: async () => {
      let query = supabase
        .from('department_quotas')
        .select(`
          *,
          department:departments(
            name
          )
        `)
        .gt('remaining_amount', 0);

      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!departmentId,
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        选择部门额度
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white border-gray-300">
          <SelectValue placeholder="请选择部门额度" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {departmentQuotas?.map((quota) => (
            <SelectItem
              key={quota.id}
              value={quota.id}
              className="hover:bg-gray-100"
            >
              {`${quota.department?.name || ''} - ${getServiceTypeName(quota.service_type)} (剩余: ${quota.remaining_amount})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};