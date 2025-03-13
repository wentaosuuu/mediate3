
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
    setCurrentUser(null);
    setIsDialogOpen(true);
  };

  // 打开编辑用户对话框
  const openEditDialog = async (user: any) => {
    try {
      setIsLoading(true);
      console.log("开始获取用户详细信息，用户ID:", user.id);

      // 获取用户的部门信息
      const departmentResult = await supabase
        .from('user_departments')
        .select('department_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (departmentResult.error) {
        console.error("获取用户部门ID失败:", departmentResult.error);
      }
      
      // 加载用户的角色信息
      const roleResult = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (roleResult.error && roleResult.error.code !== 'PGRST116') {
        // PGRST116是没有找到记录的错误，这种情况下我们只需要继续处理
        console.error("获取用户角色失败:", roleResult.error);
      }
      
      // 将角色和部门信息添加到用户对象
      const enhancedUser = {
        ...user,
        department_id: departmentResult.data?.department_id || "",
        role_id: roleResult.data?.role_id || ""
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
