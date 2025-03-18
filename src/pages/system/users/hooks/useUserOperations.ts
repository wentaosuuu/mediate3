
import { useState } from 'react';
import { useUserCreate } from './user-operations/useUserCreate';
import { useUserUpdate } from './user-operations/useUserUpdate';
import { useUserDialog } from './user-operations/useUserDialog';
import { useUserStatus } from './user-operations/useUserStatus';
import { useUserDelete } from './user-operations/useUserDelete';
import { UserFormValues } from '../components/user-form/UserFormSchema';
import { toast } from "sonner";

/**
 * 用户操作主钩子 - 整合各个子钩子的功能
 * 提供统一的接口供组件使用
 */
export const useUserOperations = (fetchUsers: () => Promise<void>) => {
  // 当前选中的用户
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 使用拆分后的功能模块
  const { isLoading: createLoading, createUser } = useUserCreate(fetchUsers);
  const { isLoading: updateLoading, updateUser } = useUserUpdate(fetchUsers);
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    isLoading: dialogLoading, 
    openCreateDialog, 
    openEditDialog 
  } = useUserDialog(setCurrentUser);
  const { isLoading: statusLoading, toggleUserStatus } = useUserStatus(fetchUsers);
  const { isLoading: deleteLoading, deleteUser } = useUserDelete(fetchUsers);
  
  // 处理用户表单提交
  const handleSubmit = async (values: UserFormValues): Promise<boolean> => {
    console.log("useUserOperations - 处理表单提交，当前用户:", currentUser, "表单数据:", values);
    
    // 使用唯一ID标识此次操作的toast
    const toastId = `submit-toast-${Date.now()}`;
    
    try {
      // 处理特殊值"none"，将其转换为空字符串
      const processedValues = {
        ...values,
        department_id: values.department_id === "none" ? "" : values.department_id,
        role_id: values.role_id === "none" ? "" : values.role_id
      };
      
      console.log("处理后的提交数据:", processedValues);
      
      let success = false;
      if (currentUser) {
        // 更新现有用户
        console.log("更新用户流程开始，用户ID:", currentUser.id);
        toast.loading("正在更新用户...", { id: toastId });
        success = await updateUser(processedValues, currentUser);
        console.log("更新用户流程结束，结果:", success);
      } else {
        // 创建新用户
        console.log("创建用户流程开始");
        toast.loading("正在创建用户...", { id: toastId });
        success = await createUser(processedValues);
        console.log("创建用户流程结束，结果:", success);
      }
      
      // 根据操作结果更新提示
      if (success) {
        toast.success(`用户${currentUser ? "更新" : "创建"}成功`, { id: toastId });
        console.log("操作成功，返回true");
        // 刷新用户列表
        await fetchUsers();
        return true;
      } else {
        console.error("操作返回失败状态");
        toast.error(`用户${currentUser ? "更新" : "创建"}失败`, { id: toastId });
        return false;
      }
    } catch (error) {
      console.error("表单提交过程中出错:", error);
      toast.error(`发生错误: ${(error as Error).message}`, { id: toastId });
      return false;
    }
  };

  // 合并加载状态
  const isLoading = createLoading || updateLoading || dialogLoading || statusLoading || deleteLoading;

  return {
    currentUser,
    isDialogOpen,
    isLoading,
    setIsDialogOpen,
    handleSubmit,
    openCreateDialog,
    openEditDialog,
    toggleUserStatus,
    deleteUser
  };
};
