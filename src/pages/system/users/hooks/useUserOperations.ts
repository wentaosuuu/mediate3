
import { useState } from 'react';
import { useUserCreate } from './user-operations/useUserCreate';
import { useUserUpdate } from './user-operations/useUserUpdate';
import { useUserDialog } from './user-operations/useUserDialog';
import { useUserStatus } from './user-operations/useUserStatus';
import { useUserDelete } from './user-operations/useUserDelete';
import { UserFormValues } from '../components/user-form/UserFormSchema';
import { useToast } from "@/hooks/use-toast";

// 用户操作主钩子 - 整合各个子钩子的功能
export const useUserOperations = (fetchUsers: () => Promise<void>) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  
  // 使用拆分后的功能模块
  const { isLoading: createLoading, createUser } = useUserCreate(fetchUsers);
  const { isLoading: updateLoading, updateUser } = useUserUpdate(fetchUsers);
  const { isDialogOpen, setIsDialogOpen, isLoading: dialogLoading, openCreateDialog, openEditDialog } = useUserDialog(setCurrentUser);
  const { isLoading: statusLoading, toggleUserStatus } = useUserStatus(fetchUsers);
  const { isLoading: deleteLoading, deleteUser } = useUserDelete(fetchUsers);

  // 合并加载状态
  const isLoading = createLoading || updateLoading || dialogLoading || statusLoading || deleteLoading;

  // 处理用户创建或更新的统一入口
  const handleSubmit = async (values: UserFormValues): Promise<boolean> => {
    console.log("useUserOperations - 处理表单提交，当前用户:", currentUser, "表单数据:", values);
    
    try {
      let success = false;
      if (currentUser) {
        // 更新现有用户
        console.log("更新用户流程开始");
        success = await updateUser(values, currentUser);
      } else {
        // 创建新用户
        console.log("创建用户流程开始");
        success = await createUser(values);
      }
      
      // 如果操作成功，关闭对话框并刷新用户列表
      if (success) {
        console.log("操作成功，准备关闭对话框并刷新列表");
        await fetchUsers(); // 确保列表被刷新
        setIsDialogOpen(false); // 关闭对话框
        return true;
      } else {
        console.error("操作返回失败状态");
        return false;
      }
    } catch (error) {
      console.error("表单提交过程中出错:", error);
      toast({
        title: "操作失败",
        description: `发生错误: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    }
  };

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
