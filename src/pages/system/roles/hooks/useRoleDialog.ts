
import { useState } from 'react';

/**
 * 角色对话框管理钩子
 * 负责管理角色表单和数据权限对话框的状态
 */
export const useRoleDialog = () => {
  // 角色表单对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  
  // 数据权限对话框状态
  const [isDataPermissionDialogOpen, setIsDataPermissionDialogOpen] = useState(false);
  const [dataPermissionRole, setDataPermissionRole] = useState<any>(null);
  
  // 打开创建角色对话框
  const openCreateDialog = () => {
    setCurrentRole(null);
    setIsDialogOpen(true);
  };

  // 打开编辑角色对话框
  const openEditDialog = async (role: any) => {
    setCurrentRole(role);
    setIsDialogOpen(true);
  };
  
  // 打开数据权限对话框
  const openDataPermissionDialog = (role: any) => {
    setDataPermissionRole(role);
    setIsDataPermissionDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    currentRole,
    setCurrentRole,
    isDataPermissionDialogOpen,
    setIsDataPermissionDialogOpen,
    dataPermissionRole,
    setDataPermissionRole,
    openCreateDialog,
    openEditDialog,
    openDataPermissionDialog
  };
};
