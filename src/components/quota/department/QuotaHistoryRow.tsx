import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { DepartmentQuota } from '@/types/quota';
import { formatDate, getTimeUnitName } from '@/utils/quotaUtils';

interface QuotaHistoryRowProps {
  quota: DepartmentQuota;
}

export const QuotaHistoryRow: React.FC<QuotaHistoryRowProps> = ({ quota }) => {
  return (
    <TableRow>
      <TableCell>{quota.department?.name || '-'}</TableCell>
      <TableCell>{quota.quota_amount}</TableCell>
      <TableCell>{quota.remaining_amount}</TableCell>
      <TableCell>{getTimeUnitName(quota.time_unit)}</TableCell>
      <TableCell>{formatDate(quota.start_date)}</TableCell>
      <TableCell>{formatDate(quota.end_date)}</TableCell>
    </TableRow>
  );
};