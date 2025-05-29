
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types/case';
import { toast } from 'sonner';
import { useUserInfo } from '@/hooks/useUserInfo';

// 搜索参数类型定义
interface MediationSearchParams {
  caseNumber?: string;
  batchNumber?: string;
  borrowerNumber?: string;
  idNumber?: string;
  customerName?: string;
  phone?: string;
  productLine?: string;
  receiver?: string;
  adjuster?: string;
  progressStatus?: string;
}

/**
 * 调解中心钩子 - 管理已分配案件的显示和操作
 */
export const useMediationCenter = () => {
  // 获取用户信息
  const { userInfo } = useUserInfo();
  
  // 状态管理
  const [assignedCases, setAssignedCases] = useState<Case[]>([]);
  const [originalCases, setOriginalCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取已分配的案件数据
  const fetchAssignedCases = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('获取已分配案件数据，用户ID:', userInfo.userId);
      
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .not('distributor', 'is', null) // 只获取已分配分案员的案件
        .neq('distributor', '') // 排除分案员为空字符串的案件
        .order('distribution_time', { ascending: false });
      
      if (error) {
        console.error('获取已分配案件数据失败:', error);
        toast.error('获取已分配案件数据失败');
        return;
      }
      
      const casesData = data || [];
      setOriginalCases(casesData); // 保存原始数据
      setAssignedCases(casesData); // 设置显示数据
      console.log('已分配案件数据:', casesData);
    } catch (error) {
      console.error('获取已分配案件数据异常:', error);
      toast.error('获取已分配案件数据发生异常');
    } finally {
      setIsLoading(false);
    }
  }, [userInfo.userId]);

  // 本地搜索过滤函数
  const filterCases = useCallback((searchParams: MediationSearchParams) => {
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
          case 'progressStatus':
            return caseItem.progress_status?.toLowerCase().includes(value.toLowerCase());
          default:
            return true;
        }
      });
    });

    return filteredCases;
  }, [originalCases]);

  // 处理顶部搜索栏搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setAssignedCases(originalCases);
      return;
    }

    // 对所有字段进行搜索
    const filteredCases = originalCases.filter(caseItem => 
      caseItem.case_number?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.batch_number?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.borrower_number?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.id_number?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.phone?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.product_line?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.receiver?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.adjuster?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.distributor?.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.progress_status?.toLowerCase().includes(query.toLowerCase())
    );

    setAssignedCases(filteredCases);
  };

  // 处理高级搜索
  const handleSearchCases = useCallback((params: MediationSearchParams) => {
    setIsLoading(true);
    
    // 使用本地过滤
    const filteredCases = filterCases(params);
    setAssignedCases(filteredCases);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`搜索完成，找到 ${filteredCases.length} 个案件`);
    }, 300);
  }, [filterCases]);

  // 重置搜索条件
  const handleReset = useCallback(() => {
    setSearchQuery('');
    setAssignedCases(originalCases);
  }, [originalCases]);

  // 处理案件详情查看
  const handleCaseDetail = useCallback((caseData: Case) => {
    console.log('查看案件详情:', caseData);
    // 这里可以打开案件详情弹窗或跳转到详情页面
  }, []);

  // 处理案件编辑
  const handleCaseEdit = useCallback((caseData: Case) => {
    console.log('编辑案件:', caseData);
    // 这里可以打开案件编辑弹窗
  }, []);

  // 初始加载已分配案件数据
  useEffect(() => {
    if (userInfo.userId) {
      fetchAssignedCases();
    }
  }, [fetchAssignedCases, userInfo.userId]);

  return {
    assignedCases,
    isLoading,
    searchQuery,
    handleSearch,
    handleSearchCases,
    handleReset,
    handleCaseDetail,
    handleCaseEdit,
    fetchAssignedCases
  };
};
