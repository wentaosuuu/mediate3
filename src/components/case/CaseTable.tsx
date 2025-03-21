
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CaseTableProps } from '@/types/case';

export const CaseTable = ({ data, isLoading, visibleColumns = [] }: CaseTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm w-full overflow-hidden">
      {/* 使用ScrollArea组件包裹表格内容，只允许表格内容滚动，而页面整体不滚动 */}
      <ScrollArea className="w-full">
        <div className="min-w-[1200px]">
          <Table>
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
