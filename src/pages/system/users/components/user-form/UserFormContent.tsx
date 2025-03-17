
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

interface UserFormContentProps {
  form: UseFormReturn<UserFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
}

// 用户表单内容组件
const UserFormContent = ({
  form,
  onSubmit,
  onCancel,
  currentUser,
  isLoading,
  departments,
  roles
}: UserFormContentProps) => {
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
      
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* 基本信息组件 */}
          <UserBasicInfo isLoading={isLoading} currentUser={currentUser} />
          
          {/* 部门和角色关联组件 */}
          <UserAssociation 
            isLoading={isLoading} 
            departments={departments} 
            roles={roles} 
          />
          
          {/* 表单操作按钮组件 */}
          <UserFormActions 
            isLoading={isLoading} 
            currentUser={currentUser} 
            onCancel={onCancel} 
          />
        </form>
      </Form>
    </>
  );
};

export default UserFormContent;
