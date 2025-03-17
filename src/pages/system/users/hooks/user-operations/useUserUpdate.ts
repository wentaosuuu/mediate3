
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { updateUserBasicInfo } from './user-update/useBasicInfoUpdate';
import { departmentAssociationModule } from './user-update/useDepartmentAssociation';
import { roleAssociationModule } from './user-update/useRoleAssociation';

/**
 * 处理用户更新的钩子
 * 整合各模块功能，协调用户更新流程
 */
export const useUserUpdate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 更新用户主函数
  const updateUser = async (values: UserFormValues, currentUser: any): Promise<boolean> => {
    console.log("开始更新用户，数据:", values);
    console.log("当前用户信息:", currentUser);
    
    if (!currentUser || !currentUser.id) {
      console.error("更新用户失败: 当前用户ID不存在");
      toast({
        title: "更新用户失败",
        description: "无法获取用户ID",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // 1. 更新用户基本信息
      await updateUserBasicInfo(currentUser.id, values);
      
      // 2. 处理部门关联
      await departmentAssociationModule.handle(currentUser.id, values.department_id);
      
      // 3. 处理角色关联
      await roleAssociationModule.handle(currentUser.id, values.role_id);
      
      // 显示成功提示
      toast({
        title: "用户更新成功",
        description: `用户 ${values.name || values.username} 已更新`,
      });
      
      // 刷新用户列表
      await fetchUsers();
      console.log("更新用户流程完成，返回成功状态");
      return true;
    } catch (error) {
      console.error('更新用户失败:', error);
      toast({
        title: "更新用户失败",
        description: (error as Error).message,
        variant: "destructive",
      });
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
