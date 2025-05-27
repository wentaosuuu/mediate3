
import * as XLSX from 'xlsx';
import { Case } from '@/types/case';
import { excelColumnMapping } from '@/components/case/form-config/caseFormConfig';
import { v4 as uuidv4 } from 'uuid';

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
        
        if (!firstSheetName) {
          reject(new Error('Excel文件中没有找到工作表'));
          return;
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将Excel数据转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        
        if (!jsonData || jsonData.length === 0) {
          reject(new Error('Excel文件中没有有效数据'));
          return;
        }
        
        // 转换为Case对象数组
        const cases = jsonData.map((row: any, index: number) => {
          try {
            // 使用标准UUID格式
            const caseItem: Partial<Case> = {
              id: uuidv4(),
              latest_progress_time: new Date().toISOString(),
              latest_edit_time: new Date().toISOString(),
              case_entry_time: new Date().toISOString(),
              distribution_time: null,
              result_time: null,
            };
            
            // 根据Excel列映射转换数据
            Object.entries(row).forEach(([excelColumn, value]) => {
              const dbField = excelColumnMapping[excelColumn as keyof typeof excelColumnMapping];
              if (dbField && value !== null && value !== undefined) {
                // 处理不同类型的数据
                let processedValue = value;
                
                // 如果是字符串，去除首尾空白
                if (typeof value === 'string') {
                  processedValue = value.trim();
                }
                
                // 如果是数字，转换为字符串（因为数据库中大部分字段是字符串类型）
                if (typeof value === 'number') {
                  processedValue = value.toString();
                }
                
                (caseItem as any)[dbField] = processedValue;
              }
            });
            
            // 验证必需字段
            const requiredFields = ['case_number', 'batch_number', 'borrower_number', 'id_number', 'customer_name'];
            const missingFields = requiredFields.filter(field => !caseItem[field as keyof Case]);
            
            if (missingFields.length > 0) {
              console.warn(`第 ${index + 2} 行数据缺少必需字段: ${missingFields.join(', ')}`);
              // 不抛出错误，而是返回null，后续会被过滤掉
              return null;
            }
            
            return caseItem as Case;
          } catch (error) {
            console.error(`处理第 ${index + 2} 行数据时出错:`, error);
            return null;
          }
        }).filter((caseItem): caseItem is Case => caseItem !== null);
        
        if (cases.length === 0) {
          reject(new Error('没有有效的案件数据，请检查Excel文件格式和必需字段'));
          return;
        }
        
        console.log(`成功解析 ${cases.length} 条有效案件数据`);
        resolve(cases);
      } catch (error) {
        console.error('Excel解析失败:', error);
        reject(new Error(`Excel文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`));
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
  try {
    // 创建工作簿和工作表
    const workbook = XLSX.utils.book_new();
    
    // 反转映射，从数据库字段映射到Excel列名
    const reverseMapping: Record<string, string> = {};
    Object.entries(excelColumnMapping).forEach(([excelColumn, dbField]) => {
      reverseMapping[dbField] = excelColumn;
    });
    
    // 模板表头（Excel列名）
    const headers = Object.keys(excelColumnMapping);
    
    // 添加示例数据行，帮助用户理解格式
    const sampleData = [
      'CASE001', // 案件编号
      'BATCH001', // 批次编号
      'BORROW001', // 借据编号
      '110101199001011234', // 身份证号
      '张三', // 客户姓名
      '13800138000', // 手机号
      '信用卡', // 产品线
      '受托方A', // 受托方
      '调解员A', // 调解员
      '分案员A', // 分案员
      '待跟进' // 跟进状态
    ];
    
    // 创建工作表数据（表头 + 示例数据）
    const worksheetData = [headers, sampleData];
    
    // 将数据转换为工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // 设置列宽
    const colWidths = headers.map(() => ({ wch: 15 }));
    worksheet['!cols'] = colWidths;
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '案件导入模板');
    
    // 生成并下载Excel文件
    XLSX.writeFile(workbook, '案件导入模板.xlsx');
    
    console.log('模板文件生成成功');
  } catch (error) {
    console.error('生成模板文件失败:', error);
    throw new Error('生成模板文件失败');
  }
};
