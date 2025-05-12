
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Columns } from 'lucide-react';
import { ColumnList } from './ColumnList';
import { ColumnSelectionActions } from './ColumnSelectionActions';
import { getConfigurableColumns } from './columnUtils';

interface ColumnSelectorProps {
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}

/**
 * 列选择器组件
 */
export const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
  visibleColumns, 
  onChange 
}) => {
  // 本地状态，用于临时保存用户的选择 (排除操作列，因为操作列总是显示的)
  const filteredVisibleColumns = visibleColumns.filter(col => col !== 'actions');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(filteredVisibleColumns);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // 处理复选框变化
  const handleCheckboxChange = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, columnId]);
    } else {
      setSelectedColumns(selectedColumns.filter(id => id !== columnId));
    }
  };

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    setDraggedItem(columnId);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // 拖拽经过
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetColumnId) return;
    
    const newSelectedColumns = [...selectedColumns];
    const draggedIndex = newSelectedColumns.indexOf(draggedItem);
    const targetIndex = newSelectedColumns.indexOf(targetColumnId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // 移除拖拽的项
      newSelectedColumns.splice(draggedIndex, 1);
      // 在目标位置插入
      newSelectedColumns.splice(targetIndex, 0, draggedItem);
      
      setSelectedColumns(newSelectedColumns);
    }
  };

  // 保存更改
  const handleSave = () => {
    // 至少要保留一列，否则拒绝保存
    if (selectedColumns.length === 0) {
      alert('请至少选择一个字段显示');
      return;
    }
    // 保存用户选择的列 + 操作列
    onChange([...selectedColumns, 'actions']);
  };

  // 全选
  const handleSelectAll = () => {
    // 全选所有列，但不包括操作列
    setSelectedColumns(getConfigurableColumns());
  };

  // 全不选
  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Columns className="h-4 w-4 mr-2" />
          自定义显示字段
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>自定义显示字段</SheetTitle>
          <SheetDescription>
            选择要在表格中显示的字段，可拖动调整顺序。操作列始终显示。
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <ColumnSelectionActions 
            onSelectAll={handleSelectAll} 
            onSelectNone={handleSelectNone} 
          />
          
          <ColumnList
            selectedColumns={selectedColumns}
            draggedItem={draggedItem}
            onCheckboxChange={handleCheckboxChange}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>
        <SheetFooter>
          <Button onClick={handleSave} className="mt-4 w-full">保存设置</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
