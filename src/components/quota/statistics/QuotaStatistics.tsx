import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ServiceTypeSelector } from '@/components/quota/department/components/ServiceTypeSelector';
import { TimeUnitSelector } from '@/components/quota/department/components/TimeUnitSelector';
import { DepartmentSelector } from '@/components/quota/department/components/DepartmentSelector';
import { StaffSelector } from '@/components/quota/staff/components/StaffSelector';
import { DateRange } from 'react-day-picker';
import { UsageChart } from './UsageChart';

export const QuotaStatistics = () => {
  // 状态管理
  const [serviceType, setServiceType] = useState('all');
  const [timeUnit, setTimeUnit] = useState('month');
  const [department, setDepartment] = useState('');
  const [staff, setStaff] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>();

  // 获取使用统计数据
  const { data: usageData, isLoading } = useQuery({
    queryKey: ['quota-usage', serviceType, timeUnit, department, staff, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('quota_usage_logs')
        .select(`
          id,
          amount,
          service_type,
          created_at,
          staff:staff_id(username),
          staff_quota:staff_quota_id(
            department_quota:department_quota_id(
              department:department_id(name)
            )
          )
        `);

      // 根据筛选条件添加过滤
      if (serviceType !== 'all') {
        query = query.eq('service_type', serviceType);
      }

      if (department) {
        query = query.eq('staff_quota.department_quota.department_id', department);
      }

      if (staff) {
        query = query.eq('staff_id', staff);
      }

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }

      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceTypeSelector
            value={serviceType}
            onValueChange={setServiceType}
          />
          <TimeUnitSelector
            value={timeUnit}
            onValueChange={setTimeUnit}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <DepartmentSelector
            value={department}
            onValueChange={setDepartment}
          />
          <StaffSelector
            value={staff}
            onValueChange={setStaff}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">额度使用趋势</h3>
        <UsageChart data={usageData || []} />
      </Card>
    </div>
  );
};