
import { useState, useRef } from 'react';
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
  const fetchingRef = useRef(false);

  // 获取角色列表
  const fetchRoles = async (): Promise<void> => {
    // 使用 ref 避免重复请求，解决竞态条件
    if (fetchingRef.current || isLoading) {
      console.log("角色数据正在加载中，跳过重复请求");
      return;
    }
    
    fetchingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log("开始获取角色列表...");
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');

      if (error) throw error;
      
      console.log(`成功获取 ${data?.length || 0} 个角色`);
      console.log("角色数据:", data);
      
      // 确保设置一个有效的数组，而不是null
      setRoles(data || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      // 出错时也设置为空数组，而不是保持之前的状态
      setRoles([]);
      toast({
        title: "获取角色列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  return {
    roles,
    setRoles,
    isLoading,
    fetchRoles
  };
};
