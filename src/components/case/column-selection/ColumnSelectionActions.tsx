
import React from 'react';
import { Button } from '@/components/ui/button';

interface ColumnSelectionActionsProps {
  onSelectAll: () => void;
  onSelectNone: () => void;
}

/**
 * 列选择操作按钮组件
 */
export const ColumnSelectionActions: React.FC<ColumnSelectionActionsProps> = ({
  onSelectAll,
  onSelectNone
}) => {
  return (
    <div className="flex space-x-2">
      <Button type="button" variant="outline" onClick={onSelectAll} size="sm">
        全选
      </Button>
      <Button type="button" variant="outline" onClick={onSelectNone} size="sm">
        全不选
      </Button>
    </div>
  );
};
