
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
    caseNumber: <TableCell className="w-[120px] truncate">{caseItem.case_number}</TableCell>,
    batchNumber: <TableCell className="w-[120px] truncate">{caseItem.batch_number}</TableCell>,
    borrowerNumber: <TableCell className="w-[120px] truncate">{caseItem.borrower_number}</TableCell>,
    idNumber: <TableCell className="w-[120px] truncate">{caseItem.id_number}</TableCell>,
    customerName: <TableCell className="w-[100px] truncate">{caseItem.customer_name}</TableCell>,
    phone: <TableCell className="w-[120px] truncate">{caseItem.phone || '-'}</TableCell>,
    productLine: <TableCell className="w-[100px] truncate">{caseItem.product_line || '-'}</TableCell>,
    receiver: <TableCell className="w-[100px] truncate">{caseItem.receiver || '-'}</TableCell>,
    adjuster: <TableCell className="w-[100px] truncate">{caseItem.adjuster || '-'}</TableCell>,
    distributor: <TableCell className="w-[100px] truncate">{caseItem.distributor || '-'}</TableCell>,
    progressStatus: <TableCell className="w-[100px] truncate">{caseItem.progress_status || '-'}</TableCell>,
    latestProgressTime: <TableCell className="w-[150px] truncate">{formatDate(caseItem.latest_progress_time)}</TableCell>,
    latestEditTime: <TableCell className="w-[150px] truncate">{formatDate(caseItem.latest_edit_time)}</TableCell>,
    caseEntryTime: <TableCell className="w-[150px] truncate">{formatDate(caseItem.case_entry_time)}</TableCell>,
    distributionTime: <TableCell className="w-[150px] truncate">{formatDate(caseItem.distribution_time)}</TableCell>,
    resultTime: <TableCell className="w-[150px] truncate">{formatDate(caseItem.result_time)}</TableCell>
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
