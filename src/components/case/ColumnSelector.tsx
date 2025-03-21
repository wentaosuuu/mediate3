
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Columns, GripVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// 定义列信息和标题的映射
const columnTitles: Record<string, string> = {
  caseNumber: '案件编号',
  batchNumber: '批次编号',
  borrowerNumber: '借据编号',
  idNumber: '身份证号',
  customerName: '客户姓名',
  phone: '手机号',
  productLine: '产品线',
  receiver: '受托方',
  adjuster: '调解员',
  distributor: '分案员',
  progressStatus: '跟进状态',
  latestProgressTime: '最新跟进时间',
  latestEditTime: '最新编辑时间',
  caseEntryTime: '案件入库时间',
  distributionTime: '分案时间',
  resultTime: '结案时间'
};

interface ColumnSelectorProps {
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({ visibleColumns, onChange }) => {
  // 本地状态，用于临时保存用户的选择
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns);
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
    onChange(selectedColumns);
  };

  // 全选
  const handleSelectAll = () => {
    setSelectedColumns(Object.keys(columnTitles));
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
            选择要在表格中显示的字段，可拖动调整顺序。
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={handleSelectAll} size="sm">
              全选
            </Button>
            <Button type="button" variant="outline" onClick={handleSelectNone} size="sm">
              全不选
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-1 py-4">
              {selectedColumns.map((columnId) => (
                <div 
                  key={columnId}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, columnId)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, columnId)}
                >
                  <div className="cursor-move text-gray-400">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <Checkbox
                    id={`column-${columnId}`}
                    checked={selectedColumns.includes(columnId)}
                    onCheckedChange={(checked) => handleCheckboxChange(columnId, checked === true)}
                  />
                  <label
                    htmlFor={`column-${columnId}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  >
                    {columnTitles[columnId]}
                  </label>
                </div>
              ))}
              
              {/* 显示未选中的列 */}
              {Object.keys(columnTitles)
                .filter(columnId => !selectedColumns.includes(columnId))
                .map(columnId => (
                  <div 
                    key={columnId}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="cursor-move text-gray-400">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <Checkbox
                      id={`column-${columnId}`}
                      checked={false}
                      onCheckedChange={(checked) => handleCheckboxChange(columnId, checked === true)}
                    />
                    <label
                      htmlFor={`column-${columnId}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 text-gray-500"
                    >
                      {columnTitles[columnId]}
                    </label>
                  </div>
                ))
              }
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
          <Button onClick={handleSave} className="mt-4 w-full">保存设置</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
