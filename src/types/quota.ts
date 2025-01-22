import { DateRange } from 'react-day-picker';

export interface Department {
  name: string | null;
}

export interface DepartmentQuota {
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
  department?: Department | null;
}

export interface DepartmentQuotaFormData {
  timeUnit: string;
  departmentId: string;
  serviceType: string;
  amount: number;
  dateRange?: DateRange;
}