import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import type { CaseTableProps } from '@/types/case';

export const CaseTable = ({ data, isLoading }: CaseTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="relative w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <CaseTableHeader />
            <TableBody>
              {isLoading ? (
                <tr>
                  <td colSpan={33} className="text-center py-4">
                    加载中...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={33} className="text-center py-4 text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                data.map((caseItem) => (
                  <CaseTableRow key={caseItem.id} caseItem={caseItem} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};