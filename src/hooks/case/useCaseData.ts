
import { useCallback, useEffect } from 'react';
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
      
      setCases(data || []);
    } catch (error) {
      console.error('获取案件数据异常:', error);
      toast.error('获取案件数据发生异常');
    } finally {
      setIsLoading(false);
    }
  }, [setCases, setIsLoading, userInfo.userId]);

  // 处理高级搜索
  const handleSearchCases = useCallback((params: SearchParams) => {
    setIsLoading(true);
    // 模拟API调用，实际项目中应替换为真实的API调用
    setTimeout(() => {
      setIsLoading(false);
      toast.success('搜索完成');
    }, 1000);
  }, [setIsLoading]);

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
        // 更新本地状态
        addNewCase(savedCase, cases, setCases);
        toast.success('案件添加成功');
      }
    } catch (error) {
      console.error('添加案件异常:', error);
      toast.error('添加案件失败，发生异常');
    }
  }, [cases, setCases, userInfo]);
  
  // 处理批量导入案件成功
  const handleImportCasesSuccess = useCallback(async (importedCases: Case[]) => {
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
      
      // 更新本地状态
      if (allInsertedCases.length > 0) {
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
  }, [cases, setCases, userInfo]);

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
    handleImportCasesSuccess
  };
};
