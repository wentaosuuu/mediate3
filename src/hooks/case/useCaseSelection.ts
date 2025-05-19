
import { useCallback } from 'react';
import { toast } from 'sonner';
import { 
  handleSelectedDistribution as distributeSelected,
  handleOneClickClose as closeSelected
} from '@/utils/caseManagementUtils';

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

  // 处理全选/取消全选
  const handleSelectAll = useCallback((cases: any[], isSelected: boolean) => {
    const newSelectedCases: Record<string, boolean> = {};
    cases.forEach(caseItem => {
      newSelectedCases[caseItem.id] = isSelected;
    });
    setSelectedCases(newSelectedCases);
  }, [setSelectedCases]);

  // 获取选中的案件IDs
  const getSelectedCaseIds = useCallback((): string[] => {
    return Object.entries(selectedCases)
      .filter(([_, isSelected]) => isSelected)
      .map(([caseId]) => caseId);
  }, [selectedCases]);

  // 包装处理选中分案操作
  const handleSelectedDistribution = useCallback(() => {
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
      toast.error('请先选择要分案的案件');
      return;
    }
    
    console.log('将要分案的案件IDs:', selectedIds);
    distributeSelected();
  }, [getSelectedCaseIds]);

  // 包装处理一键结案操作
  const handleOneClickClose = useCallback(() => {
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
      toast.error('请先选择要结案的案件');
      return;
    }
    
    console.log('将要结案的案件IDs:', selectedIds);
    closeSelected();
  }, [getSelectedCaseIds]);

  return {
    handleSelectCase,
    handleSelectAll,
    getSelectedCaseIds,
    handleSelectedDistribution,
    handleOneClickClose
  };
};
