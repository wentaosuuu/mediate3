import { DateRange } from 'react-day-picker';

export interface Department {
  id?: string;
  name: string | null;
}

export interface DepartmentQuota {
  id: string;
  tenant_id: string;
  department_id: string;
  service_type?: string | null;
  time_unit: string;
  quota_amount: number;
  remaining_amount: number;
  start_date: string;
  end_date: string;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  department?: Department | null;
}

export interface DepartmentQuotaFormData {
  timeUnit: string;
  departmentId: string;
  serviceType: string;
  amount: number;
  dateRange?: DateRange;
}

export interface StaffQuotaFormData {
  departmentQuotaId: string;
  staffId: string;
  amount: number;
}

export interface Staff {
  username: string;
}

export interface StaffQuota {
  id: string;
  tenant_id: string;
  department_quota_id: string | null;
  staff_id: string | null;
  quota_amount: number;
  remaining_amount: number;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  staff?: Staff;
  department_quota?: {
    service_type: string | null;
    department?: Department;
  };
}