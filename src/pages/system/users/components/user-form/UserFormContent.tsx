
import React from 'react';
import { Form } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import UserBasicInfo from './UserBasicInfo';
import UserAssociation from './UserAssociation';
import UserFormActions from './UserFormActions';
import { Department } from '../../hooks/user-data/useFetchDepartments';
import { Role } from '../../hooks/user-data/useFetchRoles';
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from './UserFormSchema';
import { useFormSubmitHandler } from '../../hooks/user-form/useFormSubmitHandler';

interface UserFormContentProps {
  form: UseFormReturn<UserFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
}

// 用户表单内容组件 - 更专注于展示，逻辑移至钩子
const UserFormContent = ({
  form,
  onSubmit,
  onCancel,
  currentUser,
  isLoading,
  departments,
  roles
}: UserFormContentProps) => {
  // 使用专门的钩子处理表单提交
  const { handleFormSubmit, isSubmitting } = useFormSubmitHandler(form, onSubmit, isLoading);
  
  // 计算最终的加载状态
  const combinedLoading = isLoading || isSubmitting;

  return (
    <>
      <FormHeader currentUser={currentUser} />
      
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <UserBasicInfo isLoading={combinedLoading} currentUser={currentUser} />
          <UserAssociation isLoading={combinedLoading} departments={departments} roles={roles} />
          <UserFormActions isLoading={combinedLoading} currentUser={currentUser} onCancel={onCancel} />
        </form>
      </Form>
    </>
  );
};

// 表单头部组件
const FormHeader = ({ currentUser }: { currentUser: any | null }) => (
  <DialogHeader>
    <DialogTitle>{currentUser ? "编辑用户" : "创建用户"}</DialogTitle>
    <DialogDescription>
      {currentUser 
        ? "修改用户信息，完成后点击保存。" 
        : "填写用户信息，完成后点击创建。"}
    </DialogDescription>
  </DialogHeader>
);

export default UserFormContent;
