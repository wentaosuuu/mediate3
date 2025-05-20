
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { CaseDistributionLayout } from '@/components/case/CaseDistributionLayout';
import { useCaseDistribution } from '@/hooks/case/useCaseDistribution';
import { useUserInfo } from '@/hooks/useUserInfo';
import { Toaster } from 'sonner';
import { NewCaseDialog } from '@/components/case/dialogs/NewCaseDialog';
import { ImportCasesDialog } from '@/components/case/dialogs/ImportCasesDialog';

const CaseDistribution = () => {
  const navigate = useNavigate();
  
  // 使用useUserInfo钩子获取用户信息
  const { userInfo, handleLogout, isInitialized } = useUserInfo();
  
  useEffect(() => {
    console.log("CaseDistribution - 当前用户信息:", userInfo);
  }, [userInfo]);
  
  const { 
    searchQuery,
    cases,
    isLoading,
    selectedDepartment,
    caseStatus,
    visibleColumns,
    selectedCasesCount,
    isAddDialogOpen,
    isImportDialogOpen,
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
    setCaseStatus,
    setIsAddDialogOpen,
    setIsImportDialogOpen,
    handleAddCaseSuccess,
    handleImportCasesSuccess
  } = useCaseDistribution();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/');
    }
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
          onLogout={onLogout}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <MainContent username={userInfo.username} currentPath="/case/distribution">
          <CaseDistributionLayout
            cases={cases}
            isLoading={isLoading}
            visibleColumns={visibleColumns}
            selectedDepartment={selectedDepartment}
            caseStatus={caseStatus}
            selectedCasesCount={selectedCasesCount}
            onDepartmentSelect={setSelectedDepartment}
            onStatusChange={setCaseStatus}
            onSearch={handleSearchCases}
            onReset={handleReset}
            onAddCase={handleAddCase}
            onImportCases={handleImportCases}
            onExportCases={handleExportCases}
            onColumnsChange={handleColumnVisibilityChange}
            onSelectedDistribution={handleSelectedDistribution}
            onOneClickClose={handleOneClickClose}
            onDownloadTemplate={handleDownloadTemplate}
          />
          
          {/* 新增案件弹窗 */}
          <NewCaseDialog 
            open={isAddDialogOpen} 
            onOpenChange={setIsAddDialogOpen}
            onSuccess={handleAddCaseSuccess}
          />
          
          {/* 导入案件弹窗 */}
          <ImportCasesDialog 
            open={isImportDialogOpen} 
            onOpenChange={setIsImportDialogOpen}
            onSuccess={handleImportCasesSuccess}
            onDownloadTemplate={handleDownloadTemplate}
          />
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
