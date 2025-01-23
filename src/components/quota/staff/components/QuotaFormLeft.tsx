import React from 'react';
import { DepartmentQuotaSelector } from './DepartmentQuotaSelector';
import { StaffSelector } from './StaffSelector';
import { ServiceTypeSelector } from '../../department/components/ServiceTypeSelector';

interface QuotaFormLeftProps {
  departmentQuotaId: string;
  staffId: string;
  serviceType: string;
  onDepartmentQuotaChange: (value: string) => void;
  onStaffChange: (value: string) => void;
  onServiceTypeChange: (value: string) => void;
}

export const QuotaFormLeft = ({
  departmentQuotaId,
  staffId,
  serviceType,
  onDepartmentQuotaChange,
  onStaffChange,
  onServiceTypeChange,
}: QuotaFormLeftProps) => {
  return (
    <div className="space-y-4 h-full">
      <ServiceTypeSelector 
        value={serviceType}
        onValueChange={onServiceTypeChange}
      />
      
      <DepartmentQuotaSelector
        value={departmentQuotaId}
        onValueChange={onDepartmentQuotaChange}
        serviceType={serviceType}
      />

      <StaffSelector
        value={staffId}
        onValueChange={onStaffChange}
      />
    </div>
  );
};