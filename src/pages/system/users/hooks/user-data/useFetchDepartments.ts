
import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 定义部门类型接口
export interface Department {
  id: string;
  name: string;
}

// 获取部门列表的钩子
export const useFetchDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fetchingRef = useRef(false);

  // 获取部门列表
  const fetchDepartments = useCallback(async (): Promise<void> => {
    // 使用 ref 避免重复请求，解决竞态条件
    if (fetchingRef.current || isLoading) {
      console.log("部门数据正在加载中，跳过重复请求");
      return;
    }
    
    fetchingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log("开始获取部门列表...");
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) throw error;
      
      console.log(`成功获取 ${data?.length || 0} 个部门`);
      console.log("部门数据:", data);
      
      // 确保设置一个有效的数组，而不是null
      setDepartments(data || []);
    } catch (error) {
      console.error('获取部门列表失败:', error);
      // 出错时也设置为空数组，而不是保持之前的状态
      setDepartments([]);
      toast({
        title: "获取部门列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [isLoading, toast]);

  return {
    departments,
    setDepartments,
    isLoading,
    fetchDepartments
  };
};
