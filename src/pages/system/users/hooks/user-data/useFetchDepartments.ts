
import { useState } from 'react';
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

  // 获取部门列表
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      console.log("开始获取部门列表...");
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) throw error;
      
      console.log(`成功获取 ${data?.length || 0} 个部门`);
      console.log("部门数据:", data);
      
      setDepartments(data || []);
      return data || [];
    } catch (error) {
      console.error('获取部门列表失败:', error);
      toast({
        title: "获取部门列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    departments,
    setDepartments,
    isLoading,
    fetchDepartments
  };
};
