export interface DepartmentQuota {
  id: string;
  tenant_id: string;
  department_id: string;
  time_unit: 'day' | 'week' | 'month';
  quota_amount: number;
  remaining_amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by?: string;
  updated_at: string;
}

export interface StaffQuota {
  id: string;
  tenant_id: string;
  department_quota_id: string;
  staff_id: string;
  quota_amount: number;
  remaining_amount: number;
  created_at: string;
  created_by?: string;
  updated_at: string;
}

export interface QuotaUsageLog {
  id: string;
  tenant_id: string;
  staff_quota_id: string;
  staff_id: string;
  service_type: string;
  amount: number;
  description?: string;
  created_at: string;
}