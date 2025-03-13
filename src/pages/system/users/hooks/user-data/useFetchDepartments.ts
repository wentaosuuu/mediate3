
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 获取部门列表的钩子
export const useFetchDepartments = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取部门列表
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) throw error;
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
