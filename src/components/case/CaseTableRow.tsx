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
    <TableRow>
      <TableCell className="w-[120px] truncate">{caseItem.case_number}</TableCell>
      <TableCell className="w-[120px] truncate">{caseItem.batch_number}</TableCell>
      <TableCell className="w-[120px] truncate">{caseItem.borrower_number}</TableCell>
      <TableCell className="w-[120px] truncate">{caseItem.id_number}</TableCell>
      <TableCell className="w-[100px] truncate">{caseItem.customer_name}</TableCell>
      <TableCell className="w-[120px] truncate">{caseItem.phone || '-'}</TableCell>
      <TableCell className="w-[100px] truncate">{caseItem.product_line || '-'}</TableCell>
      <TableCell className="w-[100px] truncate">{caseItem.receiver || '-'}</TableCell>
      <TableCell className="w-[100px] truncate">{caseItem.adjuster || '-'}</TableCell>
      <TableCell className="w-[100px] truncate">{caseItem.distributor || '-'}</TableCell>
      <TableCell className="w-[100px] truncate">{caseItem.progress_status || '-'}</TableCell>
      <TableCell className="w-[150px] truncate">{formatDate(caseItem.latest_progress_time)}</TableCell>
      <TableCell className="w-[150px] truncate">{formatDate(caseItem.latest_edit_time)}</TableCell>
      <TableCell className="w-[150px] truncate">{formatDate(caseItem.case_entry_time)}</TableCell>
      <TableCell className="w-[150px] truncate">{formatDate(caseItem.distribution_time)}</TableCell>
      <TableCell className="w-[150px] truncate">{formatDate(caseItem.result_time)}</TableCell>
      <TableCell className="w-[120px]">
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