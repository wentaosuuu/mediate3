
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 定义部门信息接口
interface DepartmentInfo {
  user_id: string;
  department_id: string;
  department_name: string;
}

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
        try {
          // 尝试获取部门信息
          const { data: deptData, error: deptError } = await supabase.rpc(
            'get_user_department', 
            { p_user_id: user.id } as { p_user_id: string }
          );
          
          if (deptError) {
            console.error(`获取用户 ${user.id} 的部门信息失败:`, deptError);
            return {
              ...user,
              department_id: "",
              department_name: "-"
            };
          }
          
          const departmentInfo = deptData && Array.isArray(deptData) && deptData.length > 0 
            ? deptData[0] as DepartmentInfo 
            : null;
          
          return {
            ...user,
            department_id: departmentInfo?.department_id || "",
            department_name: departmentInfo?.department_name || "-"
          };
        } catch (err) {
          console.error(`处理用户 ${user.id} 的部门信息时出错:`, err);
          return {
            ...user,
            department_id: "",
            department_name: "-"
          };
        }
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
