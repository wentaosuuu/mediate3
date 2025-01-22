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

// 更新接口定义
interface Department {
  name: string | null;
}

interface DepartmentQuota {
  id: string;
  tenant_id: string;
  department_id: string;
  service_type?: string;
  time_unit: string;
  quota_amount: number;
  remaining_amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  department?: Department;
}

export const DepartmentQuotaHistory = () => {
  const { data: quotas, isLoading } = useQuery({
    queryKey: ['department-quotas'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data, error } = await supabase
        .from('department_quotas')
        .select(`
          *,
          department:departments(name)
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DepartmentQuota[];
    },
  });

  // 获取时间单位名称
  const getTimeUnitName = (unit: string) => {
    const unitMap: Record<string, string> = {
      'day': '天',
      'week': '周',
      'month': '月',
      'custom': '自定义',
    };
    return unitMap[unit] || unit;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取服务类型名称
  const getServiceTypeName = (type?: string) => {
    const serviceMap: Record<string, string> = {
      'all': '全部服务',
      'sms': '短信服务',
      'voice': '语音服务',
      'h5': 'H5案件公示',
    };
    return type ? (serviceMap[type] || type) : '-';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">分配历史</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门</TableHead>
            <TableHead>服务类型</TableHead>
            <TableHead>分配金额</TableHead>
            <TableHead>剩余金额</TableHead>
            <TableHead>时间单位</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && quotas?.map((quota) => (
            <TableRow key={quota.id}>
              <TableCell>{quota.department?.name || '-'}</TableCell>
              <TableCell>{getServiceTypeName(quota.service_type)}</TableCell>
              <TableCell>{quota.quota_amount}</TableCell>
              <TableCell>{quota.remaining_amount}</TableCell>
              <TableCell>{getTimeUnitName(quota.time_unit)}</TableCell>
              <TableCell>{formatDate(quota.start_date)}</TableCell>
              <TableCell>{formatDate(quota.end_date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};