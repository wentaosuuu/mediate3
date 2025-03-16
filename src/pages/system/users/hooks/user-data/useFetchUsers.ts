
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 获取用户列表的钩子
export const useFetchUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取用户列表
  const fetchUsers = async () => {
    setIsLoading(true);
    
    try {
      console.log("开始获取用户列表...");
      
      // 获取基本用户信息
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (userError) throw userError;
      
      if (!userData) {
        console.log("没有找到用户");
        setUsers([]);
        return;
      }
      
      console.log(`找到 ${userData.length} 个用户`);
      
      // 为每个用户获取部门和角色信息
      const enhancedUsers = await Promise.all(
        userData.map(async (user) => {
          // 获取用户的部门信息
          const { data: deptData, error: deptError } = await supabase
            .from('user_departments')
            .select('department_id, departments:department_id(name)')
            .eq('user_id', user.id)
            .maybeSingle();
          
          let departmentId = "";
          let departmentName = "-";
          
          if (!deptError && deptData) {
            departmentId = deptData.department_id || "";
            departmentName = deptData.departments?.name || "-";
          }
          
          // 获取用户的角色信息
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role_id, roles:role_id(name)')
            .eq('user_id', user.id)
            .maybeSingle();
          
          let roleId = "";
          let roleName = "-";
          
          if (!roleError && roleData) {
            roleId = roleData.role_id || "";
            roleName = roleData.roles?.name || "-";
          }
          
          // 返回增强的用户对象
          return {
            ...user,
            department_id: departmentId,
            department_name: departmentName,
            role_id: roleId,
            role_name: roleName
          };
        })
      );
      
      console.log("格式化后的用户列表:", enhancedUsers);
      setUsers(enhancedUsers);
    } catch (error) {
      console.error("获取用户列表失败:", error);
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
    fetchUsers
  };
};
