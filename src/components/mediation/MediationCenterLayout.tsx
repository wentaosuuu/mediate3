
import React from 'react';
import { MediationSearchForm } from './MediationSearchForm';
import { MediationCenterTable } from './MediationCenterTable';
import { MediationStatusTabs } from './MediationStatusTabs';
import { MediationDepartmentSidebar } from './MediationDepartmentSidebar';
import { Case } from '@/types/case';

interface MediationCenterLayoutProps {
  assignedCases: Case[];
  isLoading: boolean;
  onSearch: (params: any) => void;
  onReset: () => void;
  onCaseDetail: (caseData: Case) => void;
  onCaseEdit: (caseData: Case) => void;
}

export const MediationCenterLayout = ({
  assignedCases,
  isLoading,
  onSearch,
  onReset,
  onCaseDetail,
  onCaseEdit
}: MediationCenterLayoutProps) => {
  return (
    <div className="flex h-full">
      {/* 左侧部门树 */}
      <div className="w-60 bg-white border-r border-gray-200 flex-shrink-0">
        <MediationDepartmentSidebar />
      </div>
      
      {/* 右侧主要内容 */}
      <div className="flex-1 flex flex-col">
        {/* 状态标签页 */}
        <div className="bg-white border-b border-gray-200">
          <MediationStatusTabs />
        </div>
        
        {/* 搜索表单 */}
        <div className="bg-white border-b border-gray-200 p-4">
          <MediationSearchForm 
            onSearch={onSearch}
            onReset={onReset}
          />
        </div>
        
        {/* 案件表格 */}
        <div className="flex-1 bg-white">
          <MediationCenterTable
            data={assignedCases}
            isLoading={isLoading}
            onCaseDetail={onCaseDetail}
            onCaseEdit={onCaseEdit}
          />
        </div>
      </div>
    </div>
  );
};
