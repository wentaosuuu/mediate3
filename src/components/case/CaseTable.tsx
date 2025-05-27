
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { CaseTableHeader } from './CaseTableHeader';
import { CaseTableRow } from './CaseTableRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CaseTableProps } from '@/types/case';
import { Case } from '@/types/case';

interface ExtendedCaseTableProps extends CaseTableProps {
  onCaseEdit?: (caseData: Case) => void;
  onCaseDelete?: (caseData: Case) => void;
  onCaseSelect?: (caseId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  selectedCases?: Record<string, boolean>;
}

export const CaseTable = ({ 
  data, 
  isLoading, 
  visibleColumns = [],
  onCaseEdit,
  onCaseDelete,
  onCaseSelect,
  onSelectAll,
  selectedCases = {}
}: ExtendedCaseTableProps) => {
  
  // 处理单个案件选择
  const handleSelectCase = (caseId: string, isSelected: boolean) => {
    if (onCaseSelect) {
      onCaseSelect(caseId, isSelected);
    }
  };
  
  // 处理全选/取消全选
  const handleSelectAll = (isSelected: boolean) => {
    if (onSelectAll) {
      onSelectAll(isSelected);
    }
  };
  
  // 检查是否全选
  const isAllSelected = data.length > 0 && data.every(caseItem => selectedCases[caseItem.id]);

  return (
    <div className="bg-white rounded-lg shadow-sm w-full overflow-hidden">
      {/* 使用响应式容器并设置最大宽度，确保在大屏幕上不会过宽 */}
      <ScrollArea className="w-full">
        <div className="min-w-[1200px] max-w-full">
          <Table>
            <CaseTableHeader 
              visibleColumns={visibleColumns} 
              onSelectAll={handleSelectAll}
              isAllSelected={isAllSelected}
              showSelection={true}
            />
            <TableBody>
              {isLoading ? (
                <tr>
                  <td colSpan={(visibleColumns?.length || 0) + 2} className="text-center py-4">
                    加载中...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={(visibleColumns?.length || 0) + 2} className="text-center py-4 text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                data.map((caseItem) => (
                  <CaseTableRow 
                    key={caseItem.id} 
                    caseItem={caseItem} 
                    visibleColumns={visibleColumns}
                    isSelected={selectedCases[caseItem.id] || false}
                    onSelectChange={(isSelected) => handleSelectCase(caseItem.id, isSelected)}
                    showSelection={true}
                    onEdit={onCaseEdit}
                    onDelete={onCaseDelete}
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
