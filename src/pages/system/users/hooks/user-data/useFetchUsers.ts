
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 获取用户列表的钩子
export const useFetchUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取用户列表
  const fetchUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // 不尝试获取 department_id，因为该字段在 users 表中不存在
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          username, 
          email, 
          phone, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) throw error;
      
      // 用户数据获取成功后，加载部门信息
      console.log("获取到的用户列表原始数据:", data);
      
      // 将用户数据映射为前端需要的格式
      const formattedUsers = (data || []).map(user => {
        return {
          ...user,
          department_name: '-' // 默认为无部门
        };
      });
      
      console.log("格式化后的用户列表:", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      toast({
        title: "获取用户列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    setUsers,
    isLoading,
    setIsLoading,
    fetchUsers
  };
};
