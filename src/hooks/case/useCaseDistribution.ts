
import { useState } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useCaseState } from './useCaseState';
import { useCaseSelection } from './useCaseSelection';
import { useCaseData } from './useCaseData';
import { useColumnVisibility } from './useColumnVisibility';
import { useCaseActions } from './useCaseActions';

/**
 * 案件分发管理钩子 - 整合所有案件分发相关的功能
 */
export const useCaseDistribution = () => {
  // 使用useUserInfo钩子获取用户信息
  const { userInfo } = useUserInfo();
  
  // 顶部搜索栏状态
  const [searchQuery, setSearchQuery] = useState('');
  
  // 使用案件状态钩子
  const caseState = useCaseState();
  
  // 使用案件选择钩子
  const caseSelection = useCaseSelection(
    caseState.selectedCases, 
    caseState.setSelectedCases
  );
  
  // 使用列可见性管理钩子
  const columnVisibility = useColumnVisibility(caseState.setVisibleColumns);
  
  // 使用案件操作钩子
  const caseActions = useCaseActions(
    caseState.cases,
    caseState.setIsAddDialogOpen,
    caseState.setIsImportDialogOpen
  );
  
  // 使用案件数据钩子
  const caseData = useCaseData(
    caseState.setCases,
    caseState.setIsLoading,
    caseState.cases
  );

  // 处理普通搜索（顶部栏）
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 重置搜索条件
  const handleReset = () => {
    caseState.setSearchParams({});
  };

  return {
    // 状态
    searchQuery,
    searchParams: caseState.searchParams,
    cases: caseState.cases,
    isLoading: caseState.isLoading,
    selectedDepartment: caseState.selectedDepartment,
    caseStatus: caseState.caseStatus,
    visibleColumns: caseState.visibleColumns,
    selectedCasesCount: caseState.selectedCasesCount,
    userInfo,
    isAddDialogOpen: caseState.isAddDialogOpen,
    isImportDialogOpen: caseState.isImportDialogOpen,
    selectedCases: caseState.selectedCases,
    
    // 方法
    handleSearch,
    handleSearchCases: caseData.handleSearchCases,
    handleReset,
    handleAddCase: caseActions.handleAddCase,
    handleImportCases: caseActions.handleImportCases,
    handleExportCases: caseActions.handleExport,
    handleColumnVisibilityChange: columnVisibility.updateColumnVisibility,
    handleSelectedDistribution: caseSelection.handleSelectedDistribution,
    handleOneClickClose: caseSelection.handleOneClickClose,
    handleDownloadTemplate: caseActions.handleDownload,
    setSelectedDepartment: caseState.setSelectedDepartment,
    setCaseStatus: caseState.setCaseStatus,
    setIsAddDialogOpen: caseState.setIsAddDialogOpen,
    setIsImportDialogOpen: caseState.setIsImportDialogOpen,
    handleAddCaseSuccess: caseData.handleAddCaseSuccess,
    handleImportCasesSuccess: caseData.handleImportCasesSuccess,
    handleSelectCase: caseSelection.handleSelectCase,
    handleSelectAll: caseSelection.handleSelectAll
  };
};
