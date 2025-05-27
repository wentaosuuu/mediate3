
import React, { useEffect, useState } from 'react';
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
import { CaseDetailDialog } from '@/components/case/dialogs/CaseDetailDialog';
import { CaseDistributionDialog } from '@/components/case/dialogs/CaseDistributionDialog';
import { ImportErrorDialog } from '@/components/case/dialogs/ImportErrorDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Case } from '@/types/case';

const CaseDistribution = () => {
  const navigate = useNavigate();
  
  // 使用useUserInfo钩子获取用户信息
  const { userInfo, handleLogout, isInitialized } = useUserInfo();
  
  // 对话框状态
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<Case | null>(null);
  const [isImportErrorDialogOpen, setIsImportErrorDialogOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<Array<{row: number, field: string, value: string, message: string}>>([]);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  
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
    isDistributionDialogOpen,
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
    setIsDistributionDialogOpen,
    handleAddCaseSuccess,
    handleImportCasesSuccess,
    handleSelectCase,
    handleSelectAll,
    selectedCases,
    handleDeleteCase,
    handleDistributionConfirm
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

  // 处理案件详情查看
  const handleCaseEdit = (caseData: Case) => {
    setSelectedCaseForDetail(caseData);
  };

  // 处理案件删除
  const handleCaseDelete = (caseData: Case) => {
    setCaseToDelete(caseData);
  };

  // 确认删除案件
  const confirmDeleteCase = async () => {
    if (caseToDelete && handleDeleteCase) {
      const success = await handleDeleteCase(caseToDelete.id);
      if (success) {
        setCaseToDelete(null);
      }
    }
  };

  // 处理导入案件成功，带错误处理
  const handleImportSuccess = (cases: Case[]) => {
    handleImportCasesSuccess(cases, (errors) => {
      setImportErrors(errors);
      setIsImportErrorDialogOpen(true);
    });
  };

  // 等待用户信息初始化完成
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">加载用户信息中...</p>
      </div>
    </div>
  }

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
            onCaseEdit={handleCaseEdit}
            onCaseDelete={handleCaseDelete}
            onCaseSelect={handleSelectCase}
            onSelectAll={handleSelectAll}
            selectedCases={selectedCases}
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
            onSuccess={handleImportSuccess}
            onDownloadTemplate={handleDownloadTemplate}
          />

          {/* 案件详情弹窗 */}
          <CaseDetailDialog
            open={!!selectedCaseForDetail}
            onOpenChange={(open) => !open && setSelectedCaseForDetail(null)}
            caseData={selectedCaseForDetail}
          />

          {/* 选中分案弹窗 */}
          <CaseDistributionDialog
            open={isDistributionDialogOpen}
            onOpenChange={setIsDistributionDialogOpen}
            selectedCasesCount={selectedCasesCount}
            onConfirm={handleDistributionConfirm}
          />

          {/* 导入错误弹窗 */}
          <ImportErrorDialog
            open={isImportErrorDialogOpen}
            onOpenChange={setIsImportErrorDialogOpen}
            errors={importErrors}
            totalRows={importErrors.length}
          />

          {/* 删除确认对话框 */}
          <AlertDialog open={!!caseToDelete} onOpenChange={(open) => !open && setCaseToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认删除</AlertDialogTitle>
                <AlertDialogDescription>
                  您确定要删除案件"{caseToDelete?.case_number}"吗？此操作不可撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteCase}>
                  确认删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
