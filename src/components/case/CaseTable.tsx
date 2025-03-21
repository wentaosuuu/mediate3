
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CaseTableProps } from '@/types/case';

export const CaseTable = ({ data, isLoading, visibleColumns = [] }: CaseTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      {/* 使用ScrollArea组件包裹表格，使其支持横向滚动 */}
      <ScrollArea className="w-full">
        <div className="relative overflow-x-auto">
          <Table className="min-w-[1200px]">
            <CaseTableHeader visibleColumns={visibleColumns} />
            <TableBody>
              {isLoading ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="text-center py-4">
                    加载中...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="text-center py-4 text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                data.map((caseItem) => (
                  <CaseTableRow 
                    key={caseItem.id} 
                    caseItem={caseItem} 
                    visibleColumns={visibleColumns} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
