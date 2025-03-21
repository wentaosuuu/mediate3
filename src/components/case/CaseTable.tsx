
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import type { CaseTableProps } from '@/types/case';
import { ScrollArea } from '@/components/ui/scroll-area';

export const CaseTable = ({ data, isLoading, visibleColumns = [] }: CaseTableProps) => {
  // 确保visibleColumns包含"actions"
  const updatedVisibleColumns = visibleColumns.includes('actions') 
    ? visibleColumns 
    : [...visibleColumns, 'actions'];
    
  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      {/* 使用ScrollArea仅为表格内容提供横向滚动 */}
      <div className="relative overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[1200px]">
            <Table>
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
        </ScrollArea>
      </div>
    </div>
  );
};
