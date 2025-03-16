
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 定义角色类型接口
export interface Role {
  id: string;
  name: string;
}

// 获取角色列表的钩子
export const useFetchRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取角色列表
  const fetchRoles = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("开始获取角色列表...");
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');

      if (error) throw error;
      
      console.log(`成功获取 ${data?.length || 0} 个角色`);
      console.log("角色数据:", data);
      
      setRoles(data || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      toast({
        title: "获取角色列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    roles,
    setRoles,
    isLoading,
    fetchRoles
  };
};
