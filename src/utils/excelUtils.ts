
import * as XLSX from 'xlsx';
import { Case } from '@/types/case';
import { excelColumnMapping } from '@/components/case/form-config/caseFormConfig';

/**
 * 从Excel文件中读取案件数据
 * @param file Excel文件
 * @returns 解析后的案件数据数组
 */
export const readExcelFile = async (file: File): Promise<Case[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('无法读取文件内容'));
          return;
        }
        
        // 解析Excel文件
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将Excel数据转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 转换为Case对象数组
        const cases = jsonData.map((row: any, index) => {
          const caseItem: Partial<Case> = {
            id: `temp-${Date.now()}-${index}`, // 临时ID，实际应用中由后端生成
            latest_progress_time: new Date().toISOString(),
            latest_edit_time: new Date().toISOString(),
            case_entry_time: new Date().toISOString(),
            distribution_time: null,
            result_time: null,
          };
          
          // 根据Excel列映射转换数据
          Object.entries(row).forEach(([excelColumn, value]) => {
            const dbField = excelColumnMapping[excelColumn as keyof typeof excelColumnMapping];
            if (dbField) {
              (caseItem as any)[dbField] = value;
            }
          });
          
          return caseItem as Case;
        });
        
        resolve(cases);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    // 以二进制方式读取文件
    reader.readAsBinaryString(file);
  });
};

/**
 * 生成案件导入模板Excel文件并下载
 */
export const generateCaseTemplateExcel = () => {
  // 创建工作簿和工作表
  const workbook = XLSX.utils.book_new();
  
  // 反转映射，从数据库字段映射到Excel列名
  const reverseMapping: Record<string, string> = {};
  Object.entries(excelColumnMapping).forEach(([excelColumn, dbField]) => {
    reverseMapping[dbField] = excelColumn;
  });
  
  // 模板表头（Excel列名）
  const headers = Object.keys(excelColumnMapping);
  
  // 创建一个只有表头的工作表数据
  const worksheetData = [headers];
  
  // 将数据转换为工作表
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '案件导入模板');
  
  // 生成并下载Excel文件
  XLSX.writeFile(workbook, '案件导入模板.xlsx');
};
