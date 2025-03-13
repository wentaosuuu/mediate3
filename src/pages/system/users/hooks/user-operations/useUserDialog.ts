
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
      // 加载用户的角色信息
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .single();
      
      // 将角色信息添加到用户对象
      const enhancedUser = {
        ...user,
        role_id: userRoles?.role_id || ""
      };
      
      console.log("打开编辑对话框，用户数据:", enhancedUser);
      setCurrentUser(enhancedUser);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("获取用户角色失败:", error);
      // 如果获取角色失败，仍然打开对话框，但没有角色信息
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
