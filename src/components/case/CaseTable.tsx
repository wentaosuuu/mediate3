
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import type { CaseTableProps } from '@/types/case';

export const CaseTable = ({ data, isLoading, visibleColumns = [] }: CaseTableProps) => {
  // 确保visibleColumns包含"actions"
  const updatedVisibleColumns = visibleColumns.includes('actions') 
    ? visibleColumns 
    : [...visibleColumns, 'actions'];
    
  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      {/* 添加水平滚动容器，但仅限于表格内容 */}
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[900px]">
          <CaseTableHeader visibleColumns={updatedVisibleColumns} />
          <TableBody>
            {isLoading ? (
              <tr>
                <td colSpan={updatedVisibleColumns.length} className="text-center py-4">
                  加载中...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={updatedVisibleColumns.length} className="text-center py-4 text-gray-500">
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((caseItem) => (
                <CaseTableRow 
                  key={caseItem.id} 
                  caseItem={caseItem} 
                  visibleColumns={updatedVisibleColumns} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
