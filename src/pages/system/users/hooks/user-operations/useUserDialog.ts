
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
      // 获取用户的部门信息
      const departmentResult = await supabase.rpc(
        'get_user_department', 
        { p_user_id: user.id }
      );
      
      if (departmentResult.error) {
        console.error("获取用户部门失败:", departmentResult.error);
      }
      
      const departmentInfo = departmentResult.data && departmentResult.data.length > 0 ? 
        departmentResult.data[0] : null;
      
      // 加载用户的角色信息
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .single();
      
      if (roleError && roleError.code !== 'PGRST116') {
        // PGRST116是没有找到记录的错误，这种情况下我们只需要继续处理
        console.error("获取用户角色失败:", roleError);
      }
      
      // 将角色和部门信息添加到用户对象
      const enhancedUser = {
        ...user,
        department_id: departmentInfo?.department_id || "",
        role_id: userRoles?.role_id || ""
      };
      
      console.log("打开编辑对话框，用户数据:", enhancedUser);
      setCurrentUser(enhancedUser);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("获取用户详细信息失败:", error);
      // 如果获取详细信息失败，仍然打开对话框，但可能没有完整信息
      setCurrentUser(user);
      setIsDialogOpen(true);
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
