
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Case } from '@/types/case';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileEdit, Phone } from 'lucide-react';

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
    caseNumber: <TableCell className="whitespace-nowrap text-xs">{caseItem.case_number}</TableCell>,
    batchNumber: <TableCell className="whitespace-nowrap text-xs">{caseItem.batch_number}</TableCell>,
    borrowerNumber: <TableCell className="whitespace-nowrap text-xs">{caseItem.borrower_number}</TableCell>,
    idNumber: <TableCell className="whitespace-nowrap text-xs">{caseItem.id_number}</TableCell>,
    customerName: <TableCell className="whitespace-nowrap text-xs">{caseItem.customer_name}</TableCell>,
    phone: <TableCell className="whitespace-nowrap text-xs">{caseItem.phone || '-'}</TableCell>,
    productLine: <TableCell className="whitespace-nowrap text-xs">{caseItem.product_line || '-'}</TableCell>,
    receiver: <TableCell className="whitespace-nowrap text-xs">{caseItem.receiver || '-'}</TableCell>,
    adjuster: <TableCell className="whitespace-nowrap text-xs">{caseItem.adjuster || '-'}</TableCell>,
    distributor: <TableCell className="whitespace-nowrap text-xs">{caseItem.distributor || '-'}</TableCell>,
    progressStatus: <TableCell className="whitespace-nowrap text-xs">{caseItem.progress_status || '-'}</TableCell>,
    latestProgressTime: <TableCell className="whitespace-nowrap text-xs">{formatDate(caseItem.latest_progress_time)}</TableCell>,
    latestEditTime: <TableCell className="whitespace-nowrap text-xs">{formatDate(caseItem.latest_edit_time)}</TableCell>,
    caseEntryTime: <TableCell className="whitespace-nowrap text-xs">{formatDate(caseItem.case_entry_time)}</TableCell>,
    distributionTime: <TableCell className="whitespace-nowrap text-xs">{formatDate(caseItem.distribution_time)}</TableCell>,
    resultTime: <TableCell className="whitespace-nowrap text-xs">{formatDate(caseItem.result_time)}</TableCell>,
    actions: (
      <TableCell className="whitespace-nowrap text-xs sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    )
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
