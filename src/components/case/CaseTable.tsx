
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import type { CaseTableProps } from '@/types/case';
import { ScrollArea } from '@/components/ui/scroll-area';

export const CaseTable = ({ data, isLoading, visibleColumns = [] }: CaseTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ScrollArea className="w-full">
        <div className="min-w-max">
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
                  <CaseTableRow key={caseItem.id} caseItem={caseItem} visibleColumns={visibleColumns} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
