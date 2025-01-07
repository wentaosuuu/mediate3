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
      <TableCell className="whitespace-nowrap bg-white sticky left-0 z-10">
        {caseItem.case_number}
      </TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.batch_number}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.borrower_number}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.id_number}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.customer_name}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.phone || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.product_line || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.receiver || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.adjuster || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.distributor || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{caseItem.progress_status || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(caseItem.latest_progress_time)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(caseItem.latest_edit_time)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(caseItem.case_entry_time)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(caseItem.distribution_time)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(caseItem.result_time)}</TableCell>
      <TableCell className="sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
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