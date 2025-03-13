
import { useState } from 'react';
import { useUserCreate } from './user-operations/useUserCreate';
import { useUserUpdate } from './user-operations/useUserUpdate';
import { useUserDialog } from './user-operations/useUserDialog';
import { useUserStatus } from './user-operations/useUserStatus';
import { useUserDelete } from './user-operations/useUserDelete';
import { UserFormValues } from '../components/user-form/UserFormSchema';

// 用户操作主钩子 - 整合各个子钩子的功能
export const useUserOperations = (fetchUsers: () => Promise<void>) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  
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
    let success = false;
    if (currentUser) {
      // 更新现有用户
      success = await updateUser(values, currentUser);
    } else {
      // 创建新用户
      success = await createUser(values);
    }
    return success;
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
