
import { useState } from 'react';
import { Case } from '@/types/case';
import { toast } from 'sonner';
import { useUserInfo } from './useUserInfo';
import { 
  handleExportCases, 
  handleSelectedDistribution, 
  handleOneClickClose, 
  handleDownloadTemplate,
  handleColumnVisibilityChange,
  addNewCase,
  importCases
} from '@/utils/caseManagementUtils';

interface SearchParams {
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

export const useCaseDistribution = () => {
  // 使用useUserInfo钩子获取用户信息
  const { userInfo } = useUserInfo();
  
  // 搜索和筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('1-1');
  const [caseStatus, setCaseStatus] = useState('pending');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'caseNumber', 'batchNumber', 'borrowerNumber', 'idNumber', 
    'customerName', 'phone', 'productLine', 'receiver', 
    'adjuster', 'distributor', 'progressStatus', 'latestProgressTime',
    'latestEditTime', 'caseEntryTime', 'distributionTime', 'resultTime',
    'actions' // 确保actions列始终存在
  ]);
  
  // 弹窗状态控制
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // 处理普通搜索（顶部栏）
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理高级搜索（表单）
  const handleSearchCases = (params: SearchParams) => {
    setSearchParams(params);
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      // 这里可以实现真实的API调用逻辑
      toast.success('搜索完成');
    }, 1000);
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({});
  };

  // 处理列显示设置的包装函数
  const updateColumnVisibility = (columns: string[]) => {
    // 确保actions列始终存在
    if (!columns.includes('actions')) {
      columns.push('actions');
    }
    handleColumnVisibilityChange(columns, setVisibleColumns);
  };
  
  // 处理新增案件
  const handleAddCase = () => {
    setIsAddDialogOpen(true);
  };
  
  // 处理导入案件
  const handleImportCases = () => {
    setIsImportDialogOpen(true);
  };
  
  // 处理新增单个案件成功
  const handleAddCaseSuccess = (newCase: Case) => {
    addNewCase(newCase, cases, setCases);
  };
  
  // 处理批量导入案件成功
  const handleImportCasesSuccess = (importedCases: Case[]) => {
    importCases(importedCases, cases, setCases);
  };

  return {
    searchQuery,
    searchParams,
    cases,
    isLoading,
    selectedDepartment,
    caseStatus,
    visibleColumns,
    userInfo,
    isAddDialogOpen,
    isImportDialogOpen,
    handleSearch,
    handleSearchCases,
    handleReset,
    handleAddCase,
    handleImportCases,
    handleExportCases: () => handleExportCases(cases),
    handleColumnVisibilityChange: updateColumnVisibility,
    handleSelectedDistribution,
    handleOneClickClose,
    handleDownloadTemplate,
    setSelectedDepartment,
    setCaseStatus,
    setIsAddDialogOpen,
    setIsImportDialogOpen,
    handleAddCaseSuccess,
    handleImportCasesSuccess
  };
};
