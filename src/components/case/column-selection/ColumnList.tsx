
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnItem } from './ColumnItem';
import { getConfigurableColumns } from './columnUtils';

interface ColumnListProps {
  selectedColumns: string[];
  draggedItem: string | null;
  onCheckboxChange: (columnId: string, checked: boolean) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
}

/**
 * 列选择列表组件
 */
export const ColumnList: React.FC<ColumnListProps> = ({
  selectedColumns,
  draggedItem,
  onCheckboxChange,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  // 获取所有可配置的列
  const configurableColumns = getConfigurableColumns();
  
  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-1 py-4">
        {/* 已选中的列 */}
        {selectedColumns.map((columnId) => (
          <ColumnItem
            key={columnId}
            columnId={columnId}
            isSelected={true}
            onCheckedChange={(checked) => onCheckboxChange(columnId, checked)}
            onDragStart={(e) => onDragStart(e, columnId)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, columnId)}
          />
        ))}
        
        {/* 未选中的列 */}
        {configurableColumns
          .filter(columnId => !selectedColumns.includes(columnId))
          .map(columnId => (
            <ColumnItem
              key={columnId}
              columnId={columnId}
              isSelected={false}
              isDraggable={false}
              onCheckedChange={(checked) => onCheckboxChange(columnId, checked)}
            />
          ))
        }
      </div>
    </ScrollArea>
  );
};
