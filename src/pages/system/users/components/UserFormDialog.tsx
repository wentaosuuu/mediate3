
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserFormContent from './user-form/UserFormContent';
import { UserFormValues } from './user-form/UserFormSchema';
import { Department } from '../hooks/user-data/useFetchDepartments';
import { Role } from '../hooks/user-data/useFetchRoles';
import { useUserForm } from '../hooks/user-form/useUserForm';

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
  onRefreshData?: () => void; // 添加刷新数据的回调
}

const UserFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentUser,
  isLoading,
  departments,
  roles,
  onRefreshData
}: UserFormDialogProps) => {
  const didInitialRefresh = useRef(false);
  
  // 使用表单钩子
  const { form, handleSubmit, resetForm } = useUserForm(
    currentUser, 
    async (values) => {
      console.log("UserFormDialog - 提交表单开始", values);
      try {
        const result = await onSubmit(values);
        console.log("UserFormDialog - 提交表单结果:", result);
        
        if (result) {
          // 如果提交成功，关闭对话框
          console.log("UserFormDialog - 提交成功，准备关闭对话框");
          resetForm(); // 先重置表单
          onOpenChange(false); // 然后关闭对话框
          return true;
        }
        return false;
      } catch (error) {
        console.error("UserFormDialog - 提交表单出错:", error);
        return false;
      }
    }, 
    () => onOpenChange(false), 
    isLoading
  );

  // 当对话框打开时，仅执行一次刷新数据，避免无限循环
  useEffect(() => {
    // 只有当对话框首次打开且刷新函数存在时才刷新数据
    if (isOpen && onRefreshData && !didInitialRefresh.current) {
      console.log("对话框首次打开，刷新数据");
      onRefreshData();
      didInitialRefresh.current = true;
    }
    
    // 当对话框关闭时，重置刷新标志
    if (!isOpen) {
      didInitialRefresh.current = false;
      console.log("对话框关闭，重置标志");
    }
  }, [isOpen, onRefreshData]);

  // 处理对话框关闭
  const handleOpenChange = (open: boolean) => {
    // 如果不在加载状态，才允许关闭对话框
    if (!isLoading || !open) {
      if (!open) {
        resetForm(); // 关闭对话框时重置表单
      }
      onOpenChange(open);
    }
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    if (!isLoading) {
      resetForm(); // 取消时重置表单
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <UserFormContent
          form={form}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          currentUser={currentUser}
          isLoading={isLoading}
          departments={departments}
          roles={roles}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
