
import { useCallback } from 'react';
import { handleExportCases, handleDownloadTemplate } from '@/utils/caseManagementUtils';
import { Case } from '@/types/case';

/**
 * 案件操作钩子 - 处理案件相关的操作，如导出、下载模板等
 */
export const useCaseActions = (
  cases: Case[], 
  setIsAddDialogOpen: (isOpen: boolean) => void,
  setIsImportDialogOpen: (isOpen: boolean) => void
) => {
  // 处理新增案件
  const handleAddCase = useCallback(() => {
    setIsAddDialogOpen(true);
  }, [setIsAddDialogOpen]);
  
  // 处理导入案件
  const handleImportCases = useCallback(() => {
    setIsImportDialogOpen(true);
  }, [setIsImportDialogOpen]);
  
  // 处理导出案件
  const handleExport = useCallback(() => {
    handleExportCases(cases);
  }, [cases]);

  // 处理下载模板
  const handleDownload = useCallback(() => {
    handleDownloadTemplate();
  }, []);

  return {
    handleAddCase,
    handleImportCases,
    handleExport,
    handleDownload
  };
};
