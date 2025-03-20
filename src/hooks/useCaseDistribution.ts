
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types/case';
import { toast } from 'sonner';
import { useUserInfo } from './useUserInfo';

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
  // 使用拆分后的用户信息钩子
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
    'latestEditTime', 'caseEntryTime', 'distributionTime', 'resultTime'
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

  // 处理添加案件
  const handleAddCase = () => {
    toast.info('添加案件功能即将上线');
  };

  // 处理导入案件
  const handleImportCases = () => {
    toast.info('导入案件功能即将上线');
  };

  // 处理导出案件
  const handleExportCases = () => {
    toast.info('导出案件功能即将上线');
  };

  // 处理列显示设置变更
  const handleColumnVisibilityChange = (columns: string[]) => {
    setVisibleColumns(columns);
    toast.success('列显示设置已更新');
  };

  // 处理选中分案
  const handleSelectedDistribution = () => {
    toast.info('选中分案功能即将上线');
  };

  // 处理一键结案
  const handleOneClickClose = () => {
    toast.info('一键结案功能即将上线');
  };

  // 处理下载案件导入模板
  const handleDownloadTemplate = () => {
    toast.info('模板下载功能即将上线');
  };

  return {
    searchQuery,
    searchParams,
    cases,
    isLoading,
    selectedDepartment,
    caseStatus,
    visibleColumns,
    userInfo, // 直接从useUserInfo中获取的用户信息
    handleSearch,
    handleSearchCases,
    handleReset,
    handleAddCase,
    handleImportCases,
    handleExportCases,
    handleColumnVisibilityChange,
    handleSelectedDistribution,
    handleOneClickClose,
    handleDownloadTemplate,
    setSelectedDepartment,
    setCaseStatus
  };
};
