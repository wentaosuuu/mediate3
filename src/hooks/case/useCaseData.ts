
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
  }, [setCases, setIsLoading]);

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
      // 确保案件对象包含tenant_id和user_id
      const caseWithMetadata = {
        ...newCase,
        tenant_id: userInfo.tenantId || 'default-tenant',
        user_id: userInfo.userId // 添加用户ID
      };
      
      // 保存新案件到数据库
      const { data, error } = await supabase
        .from('cases')
        .insert([caseWithMetadata])
        .select();
        
      if (error) {
        console.error('添加案件失败:', error);
        toast.error('添加案件失败: ' + error.message);
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
      // 确保每个案件对象都包含tenant_id和user_id
      const casesWithMetadata = importedCases.map(caseItem => ({
        ...caseItem,
        tenant_id: userInfo.tenantId || 'default-tenant',
        user_id: userInfo.userId // 添加用户ID
      }));
      
      console.log('导入的案件数据:', casesWithMetadata);
      
      // 保存导入的案件到数据库
      const { data, error } = await supabase
        .from('cases')
        .insert(casesWithMetadata)
        .select();
        
      if (error) {
        console.error('导入案件失败:', error);
        toast.error('导入案件失败: ' + error.message);
        return;
      }
      
      // 更新本地状态
      if (data && data.length > 0) {
        importCases(data, cases, setCases);
        toast.success(`成功导入 ${data.length} 个案件`);
      }
    } catch (error) {
      console.error('导入案件异常:', error);
      toast.error('导入案件失败，发生异常');
    }
  }, [cases, setCases, userInfo]);

  // 初始加载案件数据
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    fetchCases,
    handleSearchCases,
    handleAddCaseSuccess,
    handleImportCasesSuccess
  };
};
