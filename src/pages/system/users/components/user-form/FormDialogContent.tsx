
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import UserFormContent from './UserFormContent';
import { UserFormValues } from './UserFormSchema';
import { Department } from '../../hooks/user-data/useFetchDepartments';
import { Role } from '../../hooks/user-data/useFetchRoles';
import { UseFormReturn } from "react-hook-form";
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("FormDialogContent");

interface FormDialogContentProps {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  onCancel: () => void;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
}

/**
 * 表单对话框内容组件
 * 处理对话框的显示部分，包含表单和操作按钮
 */
const FormDialogContent = ({
  form,
  onSubmit,
  onCancel,
  currentUser,
  isLoading,
  departments,
  roles
}: FormDialogContentProps) => {
  logger.info("渲染对话框内容，当前用户:", currentUser?.id);
  
  // 表单提交处理
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.info("表单提交被触发");
    const values = form.getValues();
    await onSubmit(values);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{currentUser ? "编辑用户" : "创建用户"}</DialogTitle>
        <DialogDescription>
          {currentUser 
            ? "修改用户信息，完成后点击保存。" 
            : "填写用户信息，完成后点击创建。"}
        </DialogDescription>
      </DialogHeader>
      
      <UserFormContent
        form={form}
        onSubmit={handleFormSubmit}
        onCancel={onCancel}
        currentUser={currentUser}
        isLoading={isLoading}
        departments={departments}
        roles={roles}
      />
    </>
  );
};

export default FormDialogContent;
