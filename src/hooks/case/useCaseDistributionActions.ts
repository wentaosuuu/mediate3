
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Case } from '@/types/case';

// 模拟分案员数据
const mockDistributors = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
];

/**
 * 案件分发操作钩子 - 管理案件分发相关的操作
 */
export const useCaseDistributionActions = (
  cases: Case[],
  setCases: React.Dispatch<React.SetStateAction<Case[]>>,
  setSelectedCases: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] = useState(false);

  // 处理分案确认
  const handleDistributionConfirm = useCallback((distributorId: string, selectedCaseIds: string[]) => {
    const distributor = mockDistributors.find(d => d.id === distributorId);
    if (!distributor) {
      toast.error('未找到指定的分案员');
      return;
    }

    // 更新案件数据，将选中的案件分配给指定分案员
    setCases(prevCases => 
      prevCases.map(caseItem => 
        selectedCaseIds.includes(caseItem.id) 
          ? { ...caseItem, distributor: distributor.name }
          : caseItem
      )
    );

    // 清空选中状态
    setSelectedCases({});

    // 显示成功提示
    toast.success(`已将 ${selectedCaseIds.length} 个案件分配给${distributor.name}`);
    
    console.log('分案成功:', {
      distributorId,
      distributorName: distributor.name,
      selectedCaseIds,
      caseCount: selectedCaseIds.length
    });
  }, [setCases, setSelectedCases]);

  return {
    isDistributionDialogOpen,
    setIsDistributionDialogOpen,
    handleDistributionConfirm,
    mockDistributors
  };
};
