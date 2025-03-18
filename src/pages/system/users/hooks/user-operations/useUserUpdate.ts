
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 处理用户更新的钩子
 * 整合各模块功能，协调用户更新流程
 */
export const useUserUpdate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast: uiToast } = useToast();

  // 更新用户主函数
  const updateUser = async (values: UserFormValues, currentUser: any): Promise<boolean> => {
    console.log("开始更新用户，表单数据:", values);
    console.log("当前用户信息:", currentUser);
    
    if (!currentUser || !currentUser.id) {
      console.error("更新用户失败: 当前用户ID不存在");
      toast.error("更新失败：无法获取用户ID");
      return false;
    }
    
    const userId = currentUser.id;
    setIsLoading(true);
    
    // 添加唯一的toast ID以便后续更新
    const toastId = `update-user-${Date.now()}`;
    toast.loading("正在更新用户信息...", { id: toastId });
    
    try {
      console.log("开始用户更新流程，用户ID:", userId);
      
      // 处理特殊值"none"，将其转换为空字符串
      const departmentId = values.department_id === "none" ? "" : values.department_id;
      const roleId = values.role_id === "none" ? "" : values.role_id;
      
      console.log(`处理后的部门ID: "${departmentId}", 角色ID: "${roleId}"`);
      
      // 1. 更新用户基本信息
      console.log("开始更新用户基本信息...");
      
      // 构建更新数据对象
      const updateData = {
        username: values.username,
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        updated_at: new Date().toISOString()
      };
      
      console.log("准备更新用户基本信息，更新数据:", updateData);
      
      // 执行更新操作
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select('id, username, name, email, phone');

      if (error) {
        console.error('更新用户基本信息失败:', error);
        toast.error(`保存失败：${error.message || '数据库更新错误'}`, { id: toastId });
        uiToast({
          title: "更新用户信息失败",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('用户基本信息更新成功，返回数据:', data);
      
      // 2. 处理部门关联
      console.log("开始处理部门关联，部门ID:", departmentId);
      try {
        if (departmentId) {
          // 更新或创建部门关联
          console.log(`处理部门关联，用户ID: ${userId}, 部门ID: ${departmentId}`);
          const { error: deptError } = await supabase.rpc(
            'upsert_user_department',
            { 
              p_user_id: userId, 
              p_department_id: departmentId 
            }
          );
          
          if (deptError) {
            console.error("部门关联处理失败:", deptError);
            toast.error(`部门关联处理失败: ${deptError.message}`, { id: toastId });
            uiToast({
              title: "部门关联处理失败",
              description: deptError.message,
              variant: "destructive",
            });
          } else {
            console.log("部门关联处理成功");
          }
        } else {
          // 删除部门关联
          console.log("部门ID为空，移除关联");
          const { error: deleteError } = await supabase
            .from('user_departments')
            .delete()
            .eq('user_id', userId);
          
          if (deleteError) {
            console.error("移除部门关联失败:", deleteError);
            toast.error(`移除部门关联失败: ${deleteError.message}`, { id: toastId });
            uiToast({
              title: "移除部门关联失败",
              description: deleteError.message,
              variant: "destructive",
            });
          } else {
            console.log("部门关联已移除");
          }
        }
      } catch (deptError) {
        console.error("部门关联处理失败:", deptError);
        // 继续处理其他更新，不抛出错误中断更新流程
      }
      
      // 3. 处理角色关联
      console.log("开始处理角色关联，角色ID:", roleId);
      try {
        if (roleId) {
          // 处理角色关联
          console.log(`处理角色关联，用户ID: ${userId}, 角色ID: ${roleId}`);
          
          // 首先检查是否已存在角色关联
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (existingRole) {
            // 更新现有关联
            const { error: updateError } = await supabase
              .from('user_roles')
              .update({ role_id: roleId })
              .eq('user_id', userId);
              
            if (updateError) {
              console.error("更新角色关联失败:", updateError);
              toast.error(`更新角色关联失败: ${updateError.message}`, { id: toastId });
              uiToast({
                title: "更新角色关联失败",
                description: updateError.message,
                variant: "destructive",
              });
            } else {
              console.log("角色关联已更新");
            }
          } else {
            // 创建新关联
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert({ user_id: userId, role_id: roleId });
              
            if (insertError) {
              console.error("创建角色关联失败:", insertError);
              toast.error(`创建角色关联失败: ${insertError.message}`, { id: toastId });
              uiToast({
                title: "创建角色关联失败",
                description: insertError.message,
                variant: "destructive",
              });
            } else {
              console.log("角色关联已创建");
            }
          }
        } else {
          // 删除角色关联
          console.log("角色ID为空，移除关联");
          const { error: deleteError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId);
          
          if (deleteError) {
            console.error("移除角色关联失败:", deleteError);
            toast.error(`移除角色关联失败: ${deleteError.message}`, { id: toastId });
            uiToast({
              title: "移除角色关联失败",
              description: deleteError.message,
              variant: "destructive",
            });
          } else {
            console.log("角色关联已移除");
          }
        }
      } catch (roleError) {
        console.error("角色关联处理失败:", roleError);
        // 继续处理
      }
      
      // 显示成功提示
      toast.success(`用户 ${values.name || values.username} 更新成功`, { id: toastId });
      uiToast({
        title: "用户更新成功",
        description: `已成功更新用户: ${values.name || values.username}`,
      });
      
      // 刷新用户列表
      await fetchUsers();
      
      console.log("更新用户流程完成，返回成功状态");
      return true;
    } catch (error) {
      console.error('更新用户失败:', error);
      toast.error(`更新失败：${(error as Error).message}`, { id: toastId });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading, 
    updateUser
  };
};
