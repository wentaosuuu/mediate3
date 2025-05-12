
import { useState, useEffect } from 'react';
import { Case } from '@/types/case';

// 搜索参数类型定义
export interface SearchParams {
  caseNumber?: string;
  batchNumber?: string;
  borrowerNumber?: string;
  idNumber?: string;
  customerName?: string;
  phone?: string;
  productLine?: string;
  receiver?: string;
  adjuster?: string;
  distributor?: string;
  progressStatus?: string;
  startTime?: string;
  endTime?: string;
  latestProgressStartTime?: string;
  latestProgressEndTime?: string;
  latestEditStartTime?: string;
  latestEditEndTime?: string;
  distributionStartTime?: string;
  distributionEndTime?: string;
  caseEntryStartTime?: string;
  caseEntryEndTime?: string;
}

/**
 * 案件状态钩子 - 管理案件分发相关的所有状态
 */
export const useCaseState = () => {
  // 搜索和筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('1-1');
  const [caseStatus, setCaseStatus] = useState('pending');
  
  // 可见列配置
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'caseNumber', 'batchNumber', 'borrowerNumber', 'idNumber', 
    'customerName', 'phone', 'productLine', 'receiver', 
    'adjuster', 'distributor', 'progressStatus', 'latestProgressTime',
    'latestEditTime', 'caseEntryTime', 'distributionTime', 'resultTime',
    'actions' // 确保actions列始终存在
  ]);
  
  // 选择案件状态
  const [selectedCases, setSelectedCases] = useState<Record<string, boolean>>({});
  const [selectedCasesCount, setSelectedCasesCount] = useState(0);
  
  // 弹窗状态控制
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // 更新选中案件数量
  useEffect(() => {
    const count = Object.values(selectedCases).filter(Boolean).length;
    setSelectedCasesCount(count);
  }, [selectedCases]);

  return {
    // 状态
    searchQuery,
    setSearchQuery,
    searchParams,
    setSearchParams,
    cases,
    setCases,
    isLoading,
    setIsLoading,
    selectedDepartment,
    setSelectedDepartment,
    caseStatus,
    setCaseStatus,
    visibleColumns,
    setVisibleColumns,
    selectedCases,
    setSelectedCases,
    selectedCasesCount,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isImportDialogOpen,
    setIsImportDialogOpen
  };
};
