
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserFormValues } from './user-form/UserFormSchema';
import { Department } from '../hooks/user-data/useFetchDepartments';
import { Role } from '../hooks/user-data/useFetchRoles';
import { useUserForm } from '../hooks/user-form/useUserForm';
import { useFormDialog } from '../hooks/use-dialog/useFormDialog';
import { useFormData } from '../hooks/use-dialog/useFormData';
import FormDialogContent from './user-form/FormDialogContent';
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("UserFormDialog");

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
}

/**
 * 用户表单对话框组件
 * 整合各个钩子和子组件，处理用户数据的添加和修改
 */
const UserFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentUser,
  isLoading: externalLoading,
  departments,
  roles
}: UserFormDialogProps) => {
  // 使用表单钩子
  const { 
    form, 
    resetForm, 
    isLocalLoading, 
    setLocalLoading 
  } = useUserForm(currentUser);
  
  // 使用对话框钩子
  const {
    isLoading: dialogLoading,
    handleOpenChange,
    handleCancel,
    handleFormSubmit
  } = useFormDialog(onOpenChange, onSubmit, resetForm, externalLoading || isLocalLoading);
  
  // 使用表单数据钩子
  useFormData(form, currentUser, isOpen);
  
  // 综合加载状态
  const combinedLoading = externalLoading || isLocalLoading || dialogLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <FormDialogContent
          form={form}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          currentUser={currentUser}
          isLoading={combinedLoading}
          departments={departments}
          roles={roles}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
