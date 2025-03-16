
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 处理用户对话框状态的钩子
export const useUserDialog = (setCurrentUser: (user: any) => void) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 打开创建用户对话框
  const openCreateDialog = () => {
    console.log("打开创建用户对话框");
    setCurrentUser(null);
    setIsDialogOpen(true);
  };

  // 打开编辑用户对话框
  const openEditDialog = async (user: any) => {
    try {
      setIsLoading(true);
      console.log("开始获取用户详细信息，用户ID:", user.id);

      // 直接从user_departments表获取部门ID
      const departmentResult = await supabase
        .from('user_departments')
        .select('department_id, departments:department_id(name)')
        .eq('user_id', user.id)
        .single();
      
      // 如果发生错误但不是"没有找到记录"的错误
      let departmentId = "";
      let departmentName = "-";
      
      if (departmentResult.error) {
        if (departmentResult.error.code !== 'PGRST116') {
          console.error("获取用户部门信息失败:", departmentResult.error);
        }
      } else {
        departmentId = departmentResult.data?.department_id || "";
        departmentName = departmentResult.data?.departments?.name || "-";
      }
      
      console.log("获取到用户部门信息:", { departmentId, departmentName });
      
      // 加载用户的角色信息
      const roleResult = await supabase
        .from('user_roles')
        .select('role_id, roles:role_id(name)')
        .eq('user_id', user.id)
        .single();
      
      // 如果发生错误但不是"没有找到记录"的错误
      let roleId = "";
      let roleName = "-";
      
      if (roleResult.error) {
        if (roleResult.error.code !== 'PGRST116') {
          console.error("获取用户角色失败:", roleResult.error);
        }
      } else {
        roleId = roleResult.data?.role_id || "";
        roleName = roleResult.data?.roles?.name || "-";
      }
      
      console.log("获取到用户角色信息:", { roleId, roleName });
      
      // 将角色和部门信息添加到用户对象
      const enhancedUser = {
        ...user,
        department_id: departmentId,
        department_name: departmentName,
        role_id: roleId,
        role_name: roleName
      };
      
      console.log("打开编辑对话框，用户数据:", enhancedUser);
      setCurrentUser(enhancedUser);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("获取用户详细信息失败:", error);
      // 如果获取详细信息失败，仍然打开对话框，但可能没有完整信息
      setCurrentUser(user);
      setIsDialogOpen(true);
      toast({
        title: "获取用户信息失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    openCreateDialog,
    openEditDialog
  };
};
