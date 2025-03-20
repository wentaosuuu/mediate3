
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';
import { CaseStatusTabs } from '@/components/case/CaseStatusTabs';
import { DepartmentSidebar } from '@/components/case/DepartmentSidebar';
import { MainContent } from '@/components/dashboard/MainContent';
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from 'sonner';

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

const CaseDistribution = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [cases, setCases] = useState([]);
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
  const [userInfo, setUserInfo] = useState({
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

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchCases = (params: SearchParams) => {
    setSearchParams(params);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleAddCase = () => {
    // Handle add case
  };

  const handleImportCases = () => {
    // Handle import cases
  };

  const handleExportCases = () => {
    // Handle export cases
  };

  const handleColumnVisibilityChange = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const handleSelectedDistribution = () => {
    // 选中分案的逻辑
    console.log('选中分案');
  };

  const handleOneClickClose = () => {
    // 一键结案的逻辑
    console.log('一键结案');
  };

  const handleDownloadTemplate = () => {
    // 下载案件导入模板的逻辑
    console.log('下载案件导入模板');
  };

  const handleLogout = async () => {
    // 退出登录时清除supabase session
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/case/distribution"
          onMenuClick={handleMenuClick}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={userInfo.username}
          department={userInfo.department}
          role={userInfo.role}
          onLogout={handleLogout}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <MainContent username={userInfo.username} currentPath="/case/distribution">
          <div className="mb-4">
            <CaseStatusTabs value={caseStatus} onValueChange={setCaseStatus} />
          </div>
          <div className="flex">
            <DepartmentSidebar
              selectedDepartment={selectedDepartment}
              onDepartmentSelect={setSelectedDepartment}
            />
            <div className="flex-1 space-y-4">
              <CaseSearchForm
                onSearch={handleSearchCases}
                onReset={handleReset}
                onAddCase={handleAddCase}
                onImportCases={handleImportCases}
                onExportCases={handleExportCases}
                onColumnsChange={handleColumnVisibilityChange}
                visibleColumns={visibleColumns}
                onSelectedDistribution={handleSelectedDistribution}
                onOneClickClose={handleOneClickClose}
                onDownloadTemplate={handleDownloadTemplate}
              />
              <CaseTable 
                data={cases} 
                isLoading={isLoading} 
                visibleColumns={visibleColumns}
              />
            </div>
          </div>
        </MainContent>
      </div>
      
      <Toaster 
        position="top-center" 
        expand={true}
        richColors={false}
        closeButton 
        toastOptions={{
          duration: 3000,
          className: "text-sm font-medium",
          style: { 
            fontSize: '14px',
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 99999,
          }
        }}
      />
    </div>
  );
};

export default CaseDistribution;
