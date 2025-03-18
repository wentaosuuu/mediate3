
import React from 'react';
import { Form } from "@/components/ui/form";
import UserBasicInfo from './UserBasicInfo';
import UserAssociation from './UserAssociation';
import UserFormActions from './UserFormActions';
import { Department } from '../../hooks/user-data/useFetchDepartments';
import { Role } from '../../hooks/user-data/useFetchRoles';
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from './UserFormSchema';
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("UserFormContent");

interface UserFormContentProps {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
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
  logger.info("渲染表单，当前用户:", currentUser?.id);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <UserBasicInfo isLoading={isLoading} currentUser={currentUser} />
        <UserAssociation isLoading={isLoading} departments={departments} roles={roles} />
        <UserFormActions isLoading={isLoading} currentUser={currentUser} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default UserFormContent;
