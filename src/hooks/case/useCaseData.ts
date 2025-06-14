import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types/case';
import { toast } from 'sonner';
import { useUserInfo } from '@/hooks/useUserInfo';
import { addNewCase, importCases } from '@/utils/caseManagementUtils';
import { SearchParams } from './useCaseState';

/**
 * 案件数据钩子 - 处理案件数据的获取、保存等操作
 */
export const useCaseData = (
  setCases: (cases: Case[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  cases: Case[]
) => {
  // 获取用户信息
  const { userInfo } = useUserInfo();
  
  // 存储原始案件数据（未过滤的完整数据）
  const [originalCases, setOriginalCases] = useState<Case[]>([]);

  // 获取案件数据
  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('获取案件数据，用户ID:', userInfo.userId);
      
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('获取案件数据失败:', error);
        toast.error('获取案件数据失败');
        return;
      }
      
      const casesData = data || [];
      setOriginalCases(casesData); // 保存原始数据
      setCases(casesData); // 设置显示数据
    } catch (error) {
      console.error('获取案件数据异常:', error);
      toast.error('获取案件数据发生异常');
    } finally {
      setIsLoading(false);
    }
  }, [setCases, setIsLoading, userInfo.userId]);

  // 本地搜索过滤函数
  const filterCases = useCallback((searchParams: SearchParams) => {
    let filteredCases = [...originalCases];

    // 遍历搜索参数并进行本地过滤
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value || value === '') return;

      filteredCases = filteredCases.filter(caseItem => {
        switch (key) {
          case 'caseNumber':
            return caseItem.case_number?.toLowerCase().includes(value.toLowerCase());
          case 'batchNumber':
            return caseItem.batch_number?.toLowerCase().includes(value.toLowerCase());
          case 'borrowerNumber':
            return caseItem.borrower_number?.toLowerCase().includes(value.toLowerCase());
          case 'idNumber':
            return caseItem.id_number?.toLowerCase().includes(value.toLowerCase());
          case 'customerName':
            return caseItem.customer_name?.toLowerCase().includes(value.toLowerCase());
          case 'phone':
            return caseItem.phone?.toLowerCase().includes(value.toLowerCase());
          case 'productLine':
            return caseItem.product_line?.toLowerCase().includes(value.toLowerCase());
          case 'receiver':
            return caseItem.receiver?.toLowerCase().includes(value.toLowerCase());
          case 'adjuster':
            return caseItem.adjuster?.toLowerCase().includes(value.toLowerCase());
          case 'distributor':
            return caseItem.distributor?.toLowerCase().includes(value.toLowerCase());
          case 'progressStatus':
            return caseItem.progress_status?.toLowerCase().includes(value.toLowerCase());
          // 时间范围过滤
          case 'latestProgressStartTime':
            return !caseItem.latest_progress_time || new Date(caseItem.latest_progress_time) >= new Date(value);
          case 'latestProgressEndTime':
            return !caseItem.latest_progress_time || new Date(caseItem.latest_progress_time) <= new Date(value);
          case 'latestEditStartTime':
            return !caseItem.latest_edit_time || new Date(caseItem.latest_edit_time) >= new Date(value);
          case 'latestEditEndTime':
            return !caseItem.latest_edit_time || new Date(caseItem.latest_edit_time) <= new Date(value);
          case 'caseEntryStartTime':
            return !caseItem.case_entry_time || new Date(caseItem.case_entry_time) >= new Date(value);
          case 'caseEntryEndTime':
            return !caseItem.case_entry_time || new Date(caseItem.case_entry_time) <= new Date(value);
          case 'distributionStartTime':
            return !caseItem.distribution_time || new Date(caseItem.distribution_time) >= new Date(value);
          case 'distributionEndTime':
            return !caseItem.distribution_time || new Date(caseItem.distribution_time) <= new Date(value);
          default:
            return true;
        }
      });
    });

    return filteredCases;
  }, [originalCases]);

  // 处理高级搜索 - 改为本地过滤
  const handleSearchCases = useCallback((params: SearchParams) => {
    setIsLoading(true);
    
    // 使用本地过滤
    const filteredCases = filterCases(params);
    setCases(filteredCases);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`搜索完成，找到 ${filteredCases.length} 个案件`);
    }, 300);
  }, [filterCases, setCases, setIsLoading]);

  // 重置搜索 - 恢复显示所有原始数据
  const resetSearch = useCallback(() => {
    setCases(originalCases);
  }, [originalCases, setCases]);

  // 检查重复案件
  const checkDuplicateCases = useCallback(async (casesToImport: Case[]) => {
    try {
      const caseNumbers = casesToImport.map(c => c.case_number);
      const borrowerNumbers = casesToImport.map(c => c.borrower_number);
      
      const { data: existingCases, error } = await supabase
        .from('cases')
        .select('case_number, borrower_number')
        .or(`case_number.in.(${caseNumbers.join(',')}),borrower_number.in.(${borrowerNumbers.join(',')})`);
      
      if (error) {
        console.error('检查重复案件失败:', error);
        return [];
      }
      
      const duplicates: Array<{row: number, field: string, value: string, message: string}> = [];
      
      casesToImport.forEach((caseItem, index) => {
        const existingCase = existingCases?.find(existing => 
          existing.case_number === caseItem.case_number || 
          existing.borrower_number === caseItem.borrower_number
        );
        
        if (existingCase) {
          if (existingCase.case_number === caseItem.case_number) {
            duplicates.push({
              row: index + 2,
              field: '案件编号',
              value: caseItem.case_number,
              message: '案件编号已存在'
            });
          }
          if (existingCase.borrower_number === caseItem.borrower_number) {
            duplicates.push({
              row: index + 2,
              field: '借据编号',
              value: caseItem.borrower_number,
              message: '借据编号已存在'
            });
          }
        }
      });
      
      return duplicates;
    } catch (error) {
      console.error('检查重复案件异常:', error);
      return [];
    }
  }, []);

  // 处理新增单个案件成功
  const handleAddCaseSuccess = useCallback(async (newCase: Case) => {
    try {
      // 验证必需的用户信息
      if (!userInfo.userId) {
        toast.error('用户信息不完整，请重新登录');
        return;
      }

      // 确保案件对象包含必要的元数据
      const caseWithMetadata = {
        ...newCase,
        tenant_id: userInfo.tenantId || 'default-tenant',
        user_id: userInfo.userId
      };
      
      console.log('准备添加案件:', caseWithMetadata);
      
      // 保存新案件到数据库
      const { data, error } = await supabase
        .from('cases')
        .insert([caseWithMetadata])
        .select();
        
      if (error) {
        console.error('添加案件失败:', error);
        toast.error(`添加案件失败: ${error.message}`);
        return;
      }
      
      const savedCase = data?.[0];
      if (savedCase) {
        // 更新原始数据和显示数据
        const newOriginalCases = [savedCase, ...originalCases];
        setOriginalCases(newOriginalCases);
        addNewCase(savedCase, cases, setCases);
        toast.success('案件添加成功');
      }
    } catch (error) {
      console.error('添加案件异常:', error);
      toast.error('添加案件失败，发生异常');
    }
  }, [cases, setCases, userInfo, originalCases]);
  
  // 处理批量导入案件成功
  const handleImportCasesSuccess = useCallback(async (
    importedCases: Case[], 
    onError?: (errors: Array<{row: number, field: string, value: string, message: string}>) => void
  ) => {
    try {
      if (!importedCases || importedCases.length === 0) {
        toast.error('导入的案件数据为空');
        return;
      }

      // 验证必需的用户信息
      if (!userInfo.userId) {
        toast.error('用户信息不完整，请重新登录');
        return;
      }
      
      // 检查重复案件
      const duplicateErrors = await checkDuplicateCases(importedCases);
      if (duplicateErrors.length > 0) {
        if (onError) {
          onError(duplicateErrors);
        }
        return;
      }
      
      // 确保每个案件对象都包含必要的元数据，并过滤掉无效数据
      const validCases = importedCases
        .filter(caseItem => {
          // 验证必需字段
          if (!caseItem.case_number || !caseItem.batch_number || 
              !caseItem.borrower_number || !caseItem.id_number || 
              !caseItem.customer_name) {
            console.warn('跳过无效案件数据:', caseItem);
            return false;
          }
          return true;
        })
        .map(caseItem => ({
          ...caseItem,
          tenant_id: userInfo.tenantId || 'default-tenant',
          user_id: userInfo.userId,
          // 确保时间字段有默认值
          latest_progress_time: caseItem.latest_progress_time || new Date().toISOString(),
          latest_edit_time: caseItem.latest_edit_time || new Date().toISOString(),
          case_entry_time: caseItem.case_entry_time || new Date().toISOString()
        }));

      if (validCases.length === 0) {
        toast.error('没有有效的案件数据可导入');
        return;
      }
      
      console.log('准备导入的有效案件数据:', validCases);
      
      // 分批插入数据以避免请求过大
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < validCases.length; i += batchSize) {
        batches.push(validCases.slice(i, i + batchSize));
      }

      let allInsertedCases: Case[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (const batch of batches) {
        try {
          const { data, error } = await supabase
            .from('cases')
            .insert(batch)
            .select();
            
          if (error) {
            console.error('批次导入失败:', error);
            errorCount += batch.length;
          } else if (data) {
            allInsertedCases.push(...data);
            successCount += data.length;
          }
        } catch (error) {
          console.error('批次导入异常:', error);
          errorCount += batch.length;
        }
      }
      
      // 更新原始数据和显示数据
      if (allInsertedCases.length > 0) {
        const newOriginalCases = [...allInsertedCases, ...originalCases];
        setOriginalCases(newOriginalCases);
        importCases(allInsertedCases, cases, setCases);
      }

      // 显示结果
      if (successCount > 0 && errorCount === 0) {
        toast.success(`成功导入 ${successCount} 个案件`);
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`成功导入 ${successCount} 个案件，${errorCount} 个案件导入失败`);
      } else {
        toast.error('所有案件导入失败，请检查数据格式');
      }
      
    } catch (error: any) {
      console.error('导入案件异常:', error);
      toast.error(`导入案件失败: ${error?.message || '未知错误'}`);
    }
  }, [cases, setCases, userInfo, checkDuplicateCases, originalCases]);

  // 删除案件
  const handleDeleteCase = useCallback(async (caseId: string) => {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', caseId);
      
      if (error) {
        console.error('删除案件失败:', error);
        toast.error(`删除案件失败: ${error.message}`);
        return false;
      }
      
      // 更新原始数据和显示数据
      const newOriginalCases = originalCases.filter(c => c.id !== caseId);
      setOriginalCases(newOriginalCases);
      setCases(cases.filter(c => c.id !== caseId));
      toast.success('案件删除成功');
      return true;
    } catch (error) {
      console.error('删除案件异常:', error);
      toast.error('删除案件失败，发生异常');
      return false;
    }
  }, [cases, setCases, originalCases]);

  // 初始加载案件数据
  useEffect(() => {
    if (userInfo.userId) {
      fetchCases();
    }
  }, [fetchCases, userInfo.userId]);

  return {
    fetchCases,
    handleSearchCases,
    handleAddCaseSuccess,
    handleImportCasesSuccess,
    handleDeleteCase,
    resetSearch
  };
};
