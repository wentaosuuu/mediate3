
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types/case';
import { toast } from 'sonner';

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

interface UserInfo {
  username: string;
  department: string;
  role: string;
}

export const useCaseDistribution = () => {
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
  
  // 用户信息状态
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '加载中...',
    department: '加载中...',
    role: '加载中...'
  });

  // 获取用户部门和角色信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 获取当前登录用户
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          console.warn("未找到登录用户，使用模拟数据");
          // 如果没有登录用户，使用模拟数据（开发模式）
          setUserInfo({
            username: '张三',
            department: '云宝宝',
            role: '云宝人员'
          });
          return;
        }
        
        // 获取用户基本信息
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username, name')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        // 获取用户部门信息
        const { data: userDept, error: deptError } = await supabase
          .from('user_departments')
          .select('departments:department_id(name)')
          .eq('user_id', user.id)
          .maybeSingle();
          
        // 获取用户角色信息  
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('roles:role_id(name)')
          .eq('user_id', user.id)
          .maybeSingle();
          
        setUserInfo({
          username: userData?.name || userData?.username || '用户', // 优先使用姓名字段
          department: userDept?.departments?.name || '无部门',
          role: userRole?.roles?.name || '无角色'
        });
        
      } catch (error) {
        console.error("获取用户信息失败:", error);
        // 出错时使用默认值
        setUserInfo({
          username: '张三',
          department: '云宝宝',
          role: '云宝人员'
        });
      }
    };
    
    // 调用获取用户信息函数
    fetchUserInfo();
    
  }, []);

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
    userInfo,
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
