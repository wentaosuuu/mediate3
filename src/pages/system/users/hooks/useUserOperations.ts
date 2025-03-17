
import { useState } from 'react';
import { useUserCreate } from './user-operations/useUserCreate';
import { useUserUpdate } from './user-operations/useUserUpdate';
import { useUserDialog } from './user-operations/useUserDialog';
import { useUserStatus } from './user-operations/useUserStatus';
import { useUserDelete } from './user-operations/useUserDelete';
import { useUserSubmit } from './user-operations/useUserSubmit';
import { UserFormValues } from '../components/user-form/UserFormSchema';

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
  
  // 使用统一的提交处理钩子
  const { handleSubmit } = useUserSubmit({
    currentUser,
    createUser,
    updateUser
  });

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
