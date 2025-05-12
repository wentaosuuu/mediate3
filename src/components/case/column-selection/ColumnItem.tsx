
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical } from 'lucide-react';
import { columnTitles } from './columnUtils';

interface ColumnItemProps {
  columnId: string;
  isSelected: boolean;
  isDraggable?: boolean;
  onCheckedChange: (checked: boolean) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * 列选择项组件
 */
export const ColumnItem: React.FC<ColumnItemProps> = ({
  columnId,
  isSelected,
  isDraggable = true,
  onCheckedChange,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  return (
    <div 
      className={`flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer ${!isSelected ? 'text-gray-500' : ''}`}
      draggable={isDraggable && isSelected}
      onDragStart={isSelected && onDragStart ? (e) => onDragStart(e) : undefined}
      onDragEnd={isSelected && onDragEnd ? onDragEnd : undefined}
      onDragOver={isSelected && onDragOver ? onDragOver : undefined}
      onDrop={isSelected && onDrop ? onDrop : undefined}
    >
      <div className="cursor-move text-gray-400">
        <GripVertical className="h-4 w-4" />
      </div>
      <Checkbox
        id={`column-${columnId}`}
        checked={isSelected}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
      />
      <label
        htmlFor={`column-${columnId}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
      >
        {columnTitles[columnId]}
      </label>
    </div>
  );
};
