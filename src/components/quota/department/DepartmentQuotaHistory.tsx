import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DepartmentQuota {
  id: string;
  time_unit: string;
  service_type: string;
  quota_amount: number;
  remaining_amount: number;
  start_date: string;
  end_date: string;
  department_id: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}

interface Department {
  id: string;
  name: string;
}

export const DepartmentQuotaHistory = () => {
  // 获取历史记录
  const { data: quotas, isLoading: isLoadingQuotas } = useQuery({
    queryKey: ['department-quotas-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_quotas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DepartmentQuota[];
    },
  });

  // 获取部门信息
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');
      
      if (error) throw error;
      return data as Department[];
    },
  });

  if (isLoadingQuotas || isLoadingDepartments) {
    return <div>加载中...</div>;
  }

  // 创建部门ID到名称的映射
  const departmentMap = new Map(departments?.map(dept => [dept.id, dept.name]));

  // 获取服务类型名称
  const getServiceTypeName = (type: string) => {
    const serviceMap: Record<string, string> = {
      'sms': '短信服务',
      'voice': '语音服务',
      'h5': 'H5案件公示',
    };
    return serviceMap[type] || type;
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">分配历史</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门</TableHead>
            <TableHead>服务类型</TableHead>
            <TableHead>时间维度</TableHead>
            <TableHead>额度</TableHead>
            <TableHead>剩余额度</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotas?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{departmentMap.get(record.department_id) || '未知部门'}</TableCell>
              <TableCell>{getServiceTypeName(record.service_type)}</TableCell>
              <TableCell>
                {record.time_unit === 'day' ? '按天' : 
                 record.time_unit === 'week' ? '按周' : '按月'}
              </TableCell>
              <TableCell>{record.quota_amount}</TableCell>
              <TableCell>{record.remaining_amount}</TableCell>
              <TableCell>{new Date(record.start_date).toLocaleString()}</TableCell>
              <TableCell>{new Date(record.end_date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};