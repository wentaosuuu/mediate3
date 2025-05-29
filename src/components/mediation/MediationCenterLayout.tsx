
import React, { useState } from 'react';
import { MediationSearchForm } from './MediationSearchForm';
import { MediationCenterTable } from './MediationCenterTable';
import { MediationStatusTabs } from './MediationStatusTabs';
import { MediationDepartmentSidebar } from './MediationDepartmentSidebar';
import { MediationActionButtons } from './MediationActionButtons';
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
  // 案件选择状态
  const [selectedCases, setSelectedCases] = useState<Record<string, boolean>>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // 处理单个案件选择
  const handleSelectCase = (caseId: string, isSelected: boolean) => {
    setSelectedCases(prev => ({
      ...prev,
      [caseId]: isSelected
    }));
  };

  // 处理全选/取消全选
  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedCases: Record<string, boolean> = {};
    assignedCases.forEach(caseItem => {
      newSelectedCases[caseItem.id] = isSelected;
    });
    setSelectedCases(newSelectedCases);
  };

  // 处理部门选择
  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    // 这里可以根据部门ID过滤案件数据
    console.log('选择部门:', departmentId);
  };

  return (
    <div className="flex h-full">
      {/* 左侧部门树 */}
      <div className="w-60 bg-white border-r border-gray-200 flex-shrink-0">
        <MediationDepartmentSidebar 
          onDepartmentSelect={handleDepartmentSelect}
          selectedDepartment={selectedDepartment}
        />
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
        
        {/* 操作按钮 */}
        <MediationActionButtons
          selectedCases={selectedCases}
          cases={assignedCases}
          onCaseDetail={onCaseDetail}
          onCaseEdit={onCaseEdit}
        />
        
        {/* 案件表格 */}
        <div className="flex-1 bg-white">
          <MediationCenterTable
            data={assignedCases}
            isLoading={isLoading}
            selectedCases={selectedCases}
            onSelectCase={handleSelectCase}
            onSelectAll={handleSelectAll}
            onCaseDetail={onCaseDetail}
            onCaseEdit={onCaseEdit}
          />
        </div>
      </div>
    </div>
  );
};
