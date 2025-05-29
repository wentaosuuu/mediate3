
import React from 'react';
import { Button } from '@/components/ui/button';
import { Case } from '@/types/case';

interface MediationActionButtonsProps {
  selectedCases: Record<string, boolean>;
  cases: Case[];
  onCaseDetail: (caseData: Case) => void;
  onCaseEdit: (caseData: Case) => void;
}

export const MediationActionButtons = ({
  selectedCases,
  cases,
  onCaseDetail,
  onCaseEdit
}: MediationActionButtonsProps) => {
  const selectedCaseIds = Object.entries(selectedCases)
    .filter(([_, isSelected]) => isSelected)
    .map(([caseId]) => caseId);

  const selectedCasesData = cases.filter(caseItem => selectedCaseIds.includes(caseItem.id));
  const hasSelection = selectedCaseIds.length > 0;
  const hasMultipleSelection = selectedCaseIds.length > 1;

  const handleSingleCaseAction = (action: (caseData: Case) => void) => {
    if (selectedCasesData.length === 1) {
      action(selectedCasesData[0]);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 mr-4">
          {hasSelection ? `已选择 ${selectedCaseIds.length} 个案件` : '请选择案件进行操作'}
        </span>
        
        <Button
          variant="link"
          size="sm"
          className="text-blue-600 hover:text-blue-800 h-auto p-1"
          onClick={() => handleSingleCaseAction(onCaseDetail)}
          disabled={!hasSelection || hasMultipleSelection}
        >
          详情
        </Button>
        
        <Button
          variant="link"
          size="sm"
          className="text-blue-600 hover:text-blue-800 h-auto p-1"
          onClick={() => handleSingleCaseAction(onCaseEdit)}
          disabled={!hasSelection || hasMultipleSelection}
        >
          外呼
        </Button>
        
        <Button
          variant="link"
          size="sm"
          className="text-blue-600 hover:text-blue-800 h-auto p-1"
          disabled={!hasSelection}
        >
          调解
        </Button>
        
        <Button
          variant="link"
          size="sm"
          className="text-orange-600 hover:text-orange-800 h-auto p-1"
          disabled={!hasSelection}
        >
          信修外呼
        </Button>
        
        <Button
          variant="link"
          size="sm"
          className="text-blue-600 hover:text-blue-800 h-auto p-1"
          disabled={!hasSelection}
        >
          案件公示
        </Button>
        
        <Button
          variant="link"
          size="sm"
          className="text-green-600 hover:text-green-800 h-auto p-1"
          disabled={!hasSelection}
        >
          还款外呼
        </Button>
        
        <Button
          variant="link"
          size="sm"
          className="text-red-600 hover:text-red-800 h-auto p-1"
          disabled={!hasSelection}
        >
          删除
        </Button>
      </div>
    </div>
  );
};
