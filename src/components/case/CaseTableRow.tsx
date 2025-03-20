
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Case } from '@/types/case';

interface CaseTableRowProps {
  caseItem: Case;
  visibleColumns?: string[];
}

export const CaseTableRow = ({ caseItem, visibleColumns = [] }: CaseTableRowProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '-';
    }
  };

  // 将每个字段的渲染逻辑映射到一个对象中
  const cellRenderers: Record<string, React.ReactNode> = {
    caseNumber: <TableCell className="text-xs">{caseItem.case_number}</TableCell>,
    batchNumber: <TableCell className="text-xs">{caseItem.batch_number}</TableCell>,
    borrowerNumber: <TableCell className="text-xs">{caseItem.borrower_number}</TableCell>,
    idNumber: <TableCell className="text-xs">{caseItem.id_number}</TableCell>,
    customerName: <TableCell className="text-xs">{caseItem.customer_name}</TableCell>,
    phone: <TableCell className="text-xs">{caseItem.phone || '-'}</TableCell>,
    productLine: <TableCell className="text-xs">{caseItem.product_line || '-'}</TableCell>,
    receiver: <TableCell className="text-xs">{caseItem.receiver || '-'}</TableCell>,
    adjuster: <TableCell className="text-xs">{caseItem.adjuster || '-'}</TableCell>,
    distributor: <TableCell className="text-xs">{caseItem.distributor || '-'}</TableCell>,
    progressStatus: <TableCell className="text-xs">{caseItem.progress_status || '-'}</TableCell>,
    latestProgressTime: <TableCell className="text-xs">{formatDate(caseItem.latest_progress_time)}</TableCell>,
    latestEditTime: <TableCell className="text-xs">{formatDate(caseItem.latest_edit_time)}</TableCell>,
    caseEntryTime: <TableCell className="text-xs">{formatDate(caseItem.case_entry_time)}</TableCell>,
    distributionTime: <TableCell className="text-xs">{formatDate(caseItem.distribution_time)}</TableCell>,
    resultTime: <TableCell className="text-xs">{formatDate(caseItem.result_time)}</TableCell>
  };

  // 如果没有指定可见列，则默认显示所有列
  const columnsToShow = visibleColumns.length > 0 
    ? visibleColumns 
    : Object.keys(cellRenderers);

  return (
    <TableRow>
      {columnsToShow.map(column => (
        React.cloneElement(cellRenderers[column] as React.ReactElement, { key: column })
      ))}
    </TableRow>
  );
};
