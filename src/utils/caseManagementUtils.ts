
import { toast } from 'sonner';
import { generateCaseTemplateExcel } from './excelUtils';
import { Case } from '@/types/case';

/**
 * 案件管理工具函数
 * 包含案件的添加、导入、导出等操作函数
 */

// 处理添加案件
export const handleAddCase = () => {
  // 这个函数可以留空，实际实现将在组件中进行
  // 由于现在我们使用对话框组件，不再需要在这里实现逻辑
};

// 处理导入案件
export const handleImportCases = () => {
  // 这个函数可以留空，实际实现将在组件中进行
  // 由于现在我们使用对话框组件，不再需要在这里实现逻辑
};

// 处理导出案件
export const handleExportCases = (cases: Case[]) => {
  if (cases.length === 0) {
    toast.error('没有案件数据可导出');
    return;
  }

  toast.info('导出案件功能即将上线');
};

// 处理选中分案
export const handleSelectedDistribution = () => {
  toast.info('选中分案功能即将上线');
};

// 处理一键结案
export const handleOneClickClose = () => {
  toast.info('一键结案功能即将上线');
};

// 处理下载案件导入模板
export const handleDownloadTemplate = () => {
  try {
    generateCaseTemplateExcel();
    toast.success('模板下载成功');
  } catch (error) {
    console.error('下载模板失败:', error);
    toast.error('模板下载失败');
  }
};

// 处理列显示设置变更
export const handleColumnVisibilityChange = (columns: string[], callback: (columns: string[]) => void) => {
  callback(columns);
  toast.success('列显示设置已更新');
};

// 新增单个案件
export const addNewCase = (newCase: Case, cases: Case[], setCases: (cases: Case[]) => void) => {
  // 将新案件添加到列表中
  setCases([newCase, ...cases]);
};

// 批量导入案件
export const importCases = (newCases: Case[], cases: Case[], setCases: (cases: Case[]) => void) => {
  // 将新导入的案件添加到列表中
  setCases([...newCases, ...cases]);
};
