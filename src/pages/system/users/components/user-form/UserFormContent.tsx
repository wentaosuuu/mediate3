
import React, { useState } from 'react';
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
  // 本地提交状态，避免多次点击提交按钮
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 添加表单提交处理函数
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认提交行为
    
    // 如果正在加载或已经在提交中，阻止重复提交
    if (isLoading || isSubmitting) {
      console.log("表单处于加载或提交状态，忽略重复提交请求");
      return;
    }
    
    // 设置本地提交状态
    setIsSubmitting(true);
    
    console.log("表单提交被触发，准备处理数据");
    const formValues = form.getValues();
    console.log("表单数据:", formValues);
    
    // 确保下拉菜单值正确
    if (formValues.department_id === undefined) {
      console.log("部门ID未定义，设置为'none'");
      form.setValue('department_id', 'none');
    }
    if (formValues.role_id === undefined) {
      console.log("角色ID未定义，设置为'none'");
      form.setValue('role_id', 'none');
    }
    
    console.log("调用onSubmit处理表单提交");
    // 调用传入的onSubmit函数处理表单
    onSubmit();
    
    // 延迟重置提交状态，避免快速重复点击
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
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
      
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <UserBasicInfo isLoading={isLoading || isSubmitting} currentUser={currentUser} />
          <UserAssociation isLoading={isLoading || isSubmitting} departments={departments} roles={roles} />
          <UserFormActions isLoading={isLoading || isSubmitting} currentUser={currentUser} onCancel={onCancel} />
        </form>
      </Form>
    </>
  );
};

export default UserFormContent;
