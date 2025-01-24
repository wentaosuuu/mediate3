import React from 'react';
import { DepartmentQuotaSelector } from './DepartmentQuotaSelector';
import { StaffSelector } from './StaffSelector';

interface QuotaFormLeftProps {
  departmentQuotaId: string;
  staffId: string;
  onDepartmentQuotaChange: (value: string) => void;
  onStaffChange: (value: string) => void;
}

export const QuotaFormLeft = ({
  departmentQuotaId,
  staffId,
  onDepartmentQuotaChange,
  onStaffChange,
}: QuotaFormLeftProps) => {
  return (
    <div className="space-y-4 h-full">
      <DepartmentQuotaSelector
        value={departmentQuotaId}
        onValueChange={onDepartmentQuotaChange}
      />

      <StaffSelector
        value={staffId}
        onValueChange={onStaffChange}
      />
    </div>
  );
};