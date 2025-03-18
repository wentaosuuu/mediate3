
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { updateUserBasicInfo } from './user-update/useBasicInfoUpdate';
import { departmentAssociationModule } from './user-update/useDepartmentAssociation';
import { roleAssociationModule } from './user-update/useRoleAssociation';
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
      uiToast({
        title: "更新用户失败",
        description: "无法获取用户ID",
        variant: "destructive",
      });
      toast.error("更新失败：无法获取用户ID");
      return false;
    }
    
    const userId = currentUser.id;
    setIsLoading(true);
    
    try {
      console.log("开始用户更新流程，用户ID:", userId);
      
      // 处理特殊值"none"，将其转换为空字符串
      const departmentId = values.department_id === "none" ? "" : values.department_id;
      const roleId = values.role_id === "none" ? "" : values.role_id;
      
      console.log(`处理后的部门ID: "${departmentId}", 角色ID: "${roleId}"`);
      
      // 1. 更新用户基本信息
      console.log("开始更新用户基本信息...");
      const updatedUserInfo = await updateUserBasicInfo(userId, values);
      console.log("基本信息更新成功:", updatedUserInfo);
      
      // 2. 处理部门关联 - 无论是否有值都进行处理
      console.log("开始处理部门关联，部门ID:", departmentId);
      try {
        if (departmentId) {
          // 使用RPC函数处理部门关联
          const { error: deptError } = await supabase.rpc(
            'upsert_user_department',
            { 
              p_user_id: userId, 
              p_department_id: departmentId 
            }
          );
          
          if (deptError) {
            console.error("部门关联处理失败:", deptError);
            toast.error(`部门关联处理失败: ${deptError.message}`);
          } else {
            console.log("部门关联处理成功");
          }
        } else {
          // 如果部门ID为空，移除关联
          await departmentAssociationModule.remove(userId);
          console.log("部门关联已移除");
        }
      } catch (deptError) {
        console.error("部门关联处理失败:", deptError);
        toast.error(`部门关联处理失败: ${(deptError as Error).message}`);
        // 继续处理其他更新，不中断整个流程
      }
      
      // 3. 处理角色关联 - 无论是否有值都进行处理
      console.log("开始处理角色关联，角色ID:", roleId);
      try {
        if (roleId) {
          // 直接使用插入或更新操作处理角色关联
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert(
              { user_id: userId, role_id: roleId },
              { onConflict: 'user_id' }
            );
          
          if (roleError) {
            console.error("角色关联处理失败:", roleError);
            toast.error(`角色关联处理失败: ${roleError.message}`);
          } else {
            console.log("角色关联处理成功");
          }
        } else {
          // 如果角色ID为空，移除关联
          await roleAssociationModule.remove(userId);
          console.log("角色关联已移除");
        }
      } catch (roleError) {
        console.error("角色关联处理失败:", roleError);
        toast.error(`角色关联处理失败: ${(roleError as Error).message}`);
        // 继续处理，不中断整个流程
      }
      
      // 显示成功提示
      toast.success(`用户 ${values.name || values.username} 更新成功`);
      
      // 立即刷新用户列表
      console.log("立即刷新用户列表以显示更新结果");
      await fetchUsers();
      console.log("用户列表已刷新");
      
      console.log("更新用户流程完成，返回成功状态");
      return true;
    } catch (error) {
      console.error('更新用户失败:', error);
      toast.error(`更新失败：${(error as Error).message}`);
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
