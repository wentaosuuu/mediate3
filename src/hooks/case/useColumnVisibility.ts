
import { useCallback } from 'react';
import { handleColumnVisibilityChange } from '@/utils/caseManagementUtils';

/**
 * 列可见性管理钩子 - 处理表格列的显示/隐藏
 */
export const useColumnVisibility = (
  setVisibleColumns: (columns: string[]) => void
) => {
  // 处理列显示设置的包装函数
  const updateColumnVisibility = useCallback((columns: string[]) => {
    // 确保actions列始终存在
    if (!columns.includes('actions')) {
      columns.push('actions');
    }
    handleColumnVisibilityChange(columns, setVisibleColumns);
  }, [setVisibleColumns]);

  return {
    updateColumnVisibility
  };
};
