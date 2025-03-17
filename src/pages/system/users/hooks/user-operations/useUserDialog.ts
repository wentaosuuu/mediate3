
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * 用户表单对话框状态管理钩子
 * 负责处理对话框的打开关闭和用户选择
 */
export const useUserDialog = (setCurrentUser: (user: any | null) => void) => {
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
    setIsLoading(true);
    try {
      console.log("准备打开编辑对话框，用户ID:", user.id);
      
      if (!user || !user.id) {
        throw new Error("用户信息不完整");
      }
      
      // 获取完整的用户信息，包括部门和角色
      // 先获取部门信息
      const { data: deptData, error: deptError } = await supabase
        .from('user_departments')
        .select('department_id, departments:department_id(id, name)')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (deptError && deptError.code !== 'PGRST116') {
        console.error("获取用户部门信息失败:", deptError);
        throw new Error(`获取用户部门失败: ${deptError.message}`);
      }
      
      console.log("获取到的部门数据:", deptData);
      
      // 获取角色信息
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role_id, roles:role_id(id, name)')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (roleError && roleError.code !== 'PGRST116') {
        console.error("获取用户角色信息失败:", roleError);
        throw new Error(`获取用户角色失败: ${roleError.message}`);
      }
      
      console.log("获取到的角色数据:", roleData);
      
      // 合并用户信息
      const enrichedUser = {
        ...user,
        department_id: deptData?.department_id || "",
        department_name: deptData?.departments?.name || "-",
        role_id: roleData?.role_id || "",
        role_name: roleData?.roles?.name || "-"
      };
      
      console.log("完整的用户信息:", enrichedUser);
      
      // 设置当前用户并打开对话框
      setCurrentUser(enrichedUser);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("打开编辑对话框失败:", error);
      toast({
        title: "获取用户详情失败",
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
