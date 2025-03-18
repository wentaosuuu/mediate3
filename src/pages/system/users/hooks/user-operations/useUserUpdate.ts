
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
      const processedValues = {
        ...values,
        department_id: values.department_id === "none" ? "" : values.department_id,
        role_id: values.role_id === "none" ? "" : values.role_id
      };
      
      // 1. 更新用户基本信息
      const updatedUserInfo = await updateUserBasicInfo(userId, processedValues);
      console.log("基本信息更新成功:", updatedUserInfo);
      
      // 2. 处理部门关联
      console.log("开始处理部门关联，部门ID:", processedValues.department_id);
      if (processedValues.department_id) {
        await departmentAssociationModule.handle(userId, processedValues.department_id);
        console.log("部门关联处理成功");
      } else {
        // 如果部门ID为空，移除关联
        await departmentAssociationModule.remove(userId);
        console.log("部门关联已移除");
      }
      
      // 3. 处理角色关联
      console.log("开始处理角色关联，角色ID:", processedValues.role_id);
      if (processedValues.role_id) {
        await roleAssociationModule.handle(userId, processedValues.role_id);
        console.log("角色关联处理成功");
      } else {
        // 如果角色ID为空，移除关联
        await roleAssociationModule.remove(userId);
        console.log("角色关联已移除");
      }
      
      // 显示成功提示
      uiToast({
        title: "用户更新成功",
        description: `用户 ${values.name || values.username} 已更新`,
      });
      toast.success(`用户 ${values.name || values.username} 更新成功`);
      
      // 刷新用户列表
      console.log("即将刷新用户列表以显示更新结果");
      await fetchUsers();
      
      console.log("更新用户流程完成，返回成功状态");
      return true;
    } catch (error) {
      console.error('更新用户失败:', error);
      uiToast({
        title: "更新用户失败",
        description: (error as Error).message,
        variant: "destructive",
      });
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
