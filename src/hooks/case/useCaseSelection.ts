
import { useCallback } from 'react';

/**
 * 案件选择钩子 - 管理案件选择相关的功能
 */
export const useCaseSelection = (
  selectedCases: Record<string, boolean>,
  setSelectedCases: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  // 处理单个案件选择
  const handleSelectCase = useCallback((caseId: string, isSelected: boolean) => {
    setSelectedCases(prev => ({
      ...prev,
      [caseId]: isSelected
    }));
  }, [setSelectedCases]);

  // 处理全选/取消全选 - 修改签名以匹配组件期望
  const handleSelectAll = useCallback((isSelected: boolean) => {
    // 我们需要从父组件获取cases数据，所以这里返回一个curry函数
    return (cases: any[]) => {
      const newSelectedCases: Record<string, boolean> = {};
      cases.forEach(caseItem => {
        newSelectedCases[caseItem.id] = isSelected;
      });
      setSelectedCases(newSelectedCases);
    };
  }, [setSelectedCases]);

  // 获取选中的案件IDs
  const getSelectedCaseIds = useCallback((): string[] => {
    return Object.entries(selectedCases)
      .filter(([_, isSelected]) => isSelected)
      .map(([caseId]) => caseId);
  }, [selectedCases]);

  // 包装处理一键结案操作
  const handleOneClickClose = useCallback(() => {
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
      console.log('没有选中的案件进行结案操作');
      return;
    }
    
    console.log('将要结案的案件IDs:', selectedIds);
    // 这里可以添加具体的结案逻辑
  }, [getSelectedCaseIds]);

  return {
    handleSelectCase,
    handleSelectAll,
    getSelectedCaseIds,
    handleOneClickClose
  };
};
