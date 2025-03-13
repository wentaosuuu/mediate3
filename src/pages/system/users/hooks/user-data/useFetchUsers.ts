
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
      // 获取用户基本信息
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
      
      // 获取用户关联的部门信息
      const formattedUsers = await Promise.all((data || []).map(async (user) => {
        // 尝试获取部门信息
        const { data: deptData } = await supabase.rpc('get_user_department', {
          p_user_id: user.id
        });
        
        const departmentInfo = deptData && deptData.length > 0 ? deptData[0] : null;
        
        return {
          ...user,
          department_id: departmentInfo?.department_id || "",
          department_name: departmentInfo?.department_name || "-"
        };
      }));
      
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
