
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import type { CaseTableProps } from '@/types/case';

export const CaseTable = ({ data, isLoading, visibleColumns = [] }: CaseTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 使用相对定位包装外层容器 */}
      <div className="relative overflow-hidden">
        {/* 表格内容区域 - 只有表格数据部分可以滚动 */}
        <div className="w-full">
          <div className="overflow-x-auto">
            <Table>
              <CaseTableHeader visibleColumns={visibleColumns} />
              <TableBody className="relative">
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
        </div>
        
        {/* 固定在右侧的操作列 - 只在有数据时显示 */}
        {!isLoading && data.length > 0 && (
          <div className="absolute top-0 right-0 h-full bg-white shadow-[-4px_0px_6px_-2px_rgba(0,0,0,0.05)]">
            <table className="h-full">
              <thead>
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.map((caseItem) => (
                  <tr key={`action-${caseItem.id}`}>
                    <td className="p-4 align-middle">
                      <div className="space-x-2">
                        <button className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50">
                          编辑
                        </button>
                        <button className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50">
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
