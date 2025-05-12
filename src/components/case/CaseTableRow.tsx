
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Case } from '@/types/case';
import { Button } from '@/components/ui/button';
import { FileEdit, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface CaseTableRowProps {
  caseItem: Case;
  visibleColumns?: string[];
  isSelected?: boolean;
  onSelectChange?: (isSelected: boolean) => void;
  showSelection?: boolean;
}

export const CaseTableRow = ({ 
  caseItem, 
  visibleColumns = [], 
  isSelected = false,
  onSelectChange,
  showSelection = false
}: CaseTableRowProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '-';
    }
  };

  // 处理选择变更
  const handleSelectChange = (checked: boolean) => {
    if (onSelectChange) {
      onSelectChange(checked);
    }
  };

  // 将每个字段的渲染逻辑映射到一个对象中，但不包含操作列
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

  // 如果没有指定可见列，则默认显示所有列（除了操作列，操作列单独处理）
  const columnsToShow = visibleColumns.length > 0 
    ? visibleColumns.filter(col => col !== 'actions')
    : Object.keys(cellRenderers);

  // 处理案件操作的函数
  const handleEdit = () => {
    console.log('编辑案件:', caseItem.id);
    // 这里可以添加编辑案件的逻辑
  };

  const handleDelete = () => {
    console.log('删除案件:', caseItem.id);
    // 这里可以添加删除案件的逻辑
  };

  return (
    <TableRow>
      {/* 添加选择框列 */}
      {showSelection && (
        <TableCell className="text-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelectChange}
            aria-label={`选择案件 ${caseItem.case_number}`}
            className="mx-auto"
          />
        </TableCell>
      )}
      
      {columnsToShow.map(column => (
        React.cloneElement(cellRenderers[column] as React.ReactElement, { key: column })
      ))}
      {/* 添加固定在右侧的操作列 */}
      <TableCell className="sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
