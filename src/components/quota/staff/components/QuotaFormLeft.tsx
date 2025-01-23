import React from 'react';
import { DepartmentSelector } from '@/components/quota/department/components/DepartmentSelector';
import { StaffSelector } from '../components/StaffSelector';
import { DepartmentQuotaSelector } from '../components/DepartmentQuotaSelector';

interface QuotaFormLeftProps {
  department: string;
  setDepartment: (value: string) => void;
  staff: string;
  setStaff: (value: string) => void;
  departmentQuota: string;
  setDepartmentQuota: (value: string) => void;
}

export const QuotaFormLeft = ({
  department,
  setDepartment,
  staff,
  setStaff,
  departmentQuota,
  setDepartmentQuota,
}: QuotaFormLeftProps) => {
  return (
    <div className="space-y-4">
      <DepartmentSelector
        value={department}
        onValueChange={setDepartment}
      />
      <StaffSelector
        value={staff}
        onValueChange={setStaff}
        departmentId={department}
      />
      <DepartmentQuotaSelector
        value={departmentQuota}
        onValueChange={setDepartmentQuota}
        departmentId={department}
      />
    </div>
  );
};