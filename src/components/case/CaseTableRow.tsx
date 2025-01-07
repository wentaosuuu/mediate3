import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Case } from '@/types/case';

interface CaseTableRowProps {
  caseItem: Case;
}

export const CaseTableRow = ({ caseItem }: CaseTableRowProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

  return (
    <TableRow className="relative">
      <TableCell className="sticky left-0 z-20 bg-white w-[120px] truncate">
        {caseItem.case_number}
      </TableCell>
      <div className="flex">
        <TableCell className="w-[120px] truncate">{caseItem.batch_number}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.borrower_number}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.id_number}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.customer_name}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.phone || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.product_line || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.loan_amount || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.repaid_amount || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.remaining_amount || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.total_periods || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.remaining_periods || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.overdue_date)}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.overdue_days || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.overdue_m_value || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.progress_status || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.client || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.delegation_period || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.is_delegation_expired || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.delegation_expiry_time)}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.first_delegation_time)}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.latest_progress_time)}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.latest_edit_time)}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.distribution_time)}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.case_entry_time)}</TableCell>
        <TableCell className="w-[120px] truncate">{formatDate(caseItem.result_time)}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.preferential_policy || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.actual_repayment || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.reduction_amount || '-'}</TableCell>
        <TableCell className="w-[120px] truncate">{caseItem.installment_amount || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.installment_periods || '-'}</TableCell>
        <TableCell className="w-[100px] truncate">{caseItem.mediation_status || '-'}</TableCell>
      </div>
      <TableCell className="sticky right-0 z-20 bg-white w-[120px]">
        <div className="space-x-2">
          <Button size="sm" variant="outline">
            编辑
          </Button>
          <Button size="sm" variant="outline">
            删除
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};