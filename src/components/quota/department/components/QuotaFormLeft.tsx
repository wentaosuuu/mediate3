import React from 'react';
import { TimeUnitSelector } from './TimeUnitSelector';
import { DepartmentSelector } from './DepartmentSelector';
import { ServiceTypeSelector } from './ServiceTypeSelector';
import { DateRange } from 'react-day-picker';

interface QuotaFormLeftProps {
  timeUnit: string;
  dateRange?: DateRange;
  departmentId: string;
  serviceType: string;
  onTimeUnitChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onDepartmentChange: (value: string) => void;
  onServiceTypeChange: (value: string) => void;
}

export const QuotaFormLeft = ({
  timeUnit,
  dateRange,
  departmentId,
  serviceType,
  onTimeUnitChange,
  onDateRangeChange,
  onDepartmentChange,
  onServiceTypeChange,
}: QuotaFormLeftProps) => {
  return (
    <div className="space-y-4 h-full">
      <TimeUnitSelector
        value={timeUnit}
        onValueChange={onTimeUnitChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />

      <DepartmentSelector
        value={departmentId}
        onValueChange={onDepartmentChange}
      />

      <ServiceTypeSelector
        value={serviceType}
        onValueChange={onServiceTypeChange}
      />
    </div>
  );
};