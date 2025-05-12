
import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

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
  
  // 添加选中案件状态
  const [selectedCases, setSelectedCases] = useState<Record<string, boolean>>({});
  const [selectedCasesCount, setSelectedCasesCount] = useState(0);
  
  // 弹窗状态控制
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // 获取案件数据
  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('获取案件数据失败:', error);
        toast.error('获取案件数据失败');
        return;
      }
      
      setCases(data || []);
    } catch (error) {
      console.error('获取案件数据异常:', error);
      toast.error('获取案件数据发生异常');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载案件数据
  useEffect(() => {
    fetchCases();
  }, []);

  // 更新选中案件数量
  useEffect(() => {
    const count = Object.values(selectedCases).filter(Boolean).length;
    setSelectedCasesCount(count);
  }, [selectedCases]);

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
  const handleAddCaseSuccess = async (newCase: Case) => {
    try {
      // 保存新案件到数据库
      const { data, error } = await supabase
        .from('cases')
        .insert([newCase])
        .select();
        
      if (error) {
        console.error('添加案件失败:', error);
        toast.error('添加案件失败');
        return;
      }
      
      const savedCase = data?.[0];
      if (savedCase) {
        // 更新本地状态
        addNewCase(savedCase, cases, setCases);
        toast.success('案件添加成功');
      }
    } catch (error) {
      console.error('添加案件异常:', error);
      toast.error('添加案件失败，发生异常');
    }
  };
  
  // 处理批量导入案件成功
  const handleImportCasesSuccess = async (importedCases: Case[]) => {
    try {
      // 保存导入的案件到数据库
      const { data, error } = await supabase
        .from('cases')
        .insert(importedCases)
        .select();
        
      if (error) {
        console.error('导入案件失败:', error);
        toast.error('导入案件失败');
        return;
      }
      
      // 更新本地状态
      if (data && data.length > 0) {
        importCases(data, cases, setCases);
        toast.success(`成功导入 ${data.length} 个案件`);
      }
    } catch (error) {
      console.error('导入案件异常:', error);
      toast.error('导入案件失败，发生异常');
    }
  };

  // 处理案件选择
  const handleSelectCase = (caseId: string, isSelected: boolean) => {
    setSelectedCases(prev => ({
      ...prev,
      [caseId]: isSelected
    }));
  };

  // 处理全选/取消全选
  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedCases: Record<string, boolean> = {};
    cases.forEach(caseItem => {
      newSelectedCases[caseItem.id] = isSelected;
    });
    setSelectedCases(newSelectedCases);
  };

  // 获取选中的案件IDs
  const getSelectedCaseIds = (): string[] => {
    return Object.entries(selectedCases)
      .filter(([_, isSelected]) => isSelected)
      .map(([caseId]) => caseId);
  };

  // 包装处理选中分案操作
  const handleDistributeSelected = () => {
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
      toast.error('请先选择要分案的案件');
      return;
    }
    
    console.log('将要分案的案件IDs:', selectedIds);
    handleSelectedDistribution();
  };

  // 包装处理一键结案操作
  const handleCloseSelected = () => {
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
      toast.error('请先选择要结案的案件');
      return;
    }
    
    console.log('将要结案的案件IDs:', selectedIds);
    handleOneClickClose();
  };

  return {
    searchQuery,
    searchParams,
    cases,
    isLoading,
    selectedDepartment,
    caseStatus,
    visibleColumns,
    selectedCasesCount,
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
    handleSelectedDistribution: handleDistributeSelected,
    handleOneClickClose: handleCloseSelected,
    handleDownloadTemplate,
    setSelectedDepartment,
    setCaseStatus,
    setIsAddDialogOpen,
    setIsImportDialogOpen,
    handleAddCaseSuccess,
    handleImportCasesSuccess,
    handleSelectCase,
    handleSelectAll,
    selectedCases
  };
};
