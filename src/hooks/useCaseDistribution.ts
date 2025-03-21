
import { useState } from 'react';
import { Case } from '@/types/case';
import { toast } from 'sonner';
import { useUserInfo } from './useUserInfo';
import { 
  handleAddCase, 
  handleImportCases, 
  handleExportCases, 
  handleSelectedDistribution, 
  handleOneClickClose, 
  handleDownloadTemplate,
  handleColumnVisibilityChange
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
    'actions' // 确保操作列在默认可见列中
  ]);

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
    // 确保columns中始终包含actions
    const columnsWithActions = columns.includes('actions') 
      ? columns 
      : [...columns, 'actions'];
    handleColumnVisibilityChange(columnsWithActions, setVisibleColumns);
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
    handleSearch,
    handleSearchCases,
    handleReset,
    handleAddCase, // 直接从工具函数导出
    handleImportCases, // 直接从工具函数导出
    handleExportCases, // 直接从工具函数导出
    handleColumnVisibilityChange: updateColumnVisibility, // 使用包装函数
    handleSelectedDistribution, // 直接从工具函数导出
    handleOneClickClose, // 直接从工具函数导出
    handleDownloadTemplate, // 直接从工具函数导出
    setSelectedDepartment,
    setCaseStatus
  };
};
