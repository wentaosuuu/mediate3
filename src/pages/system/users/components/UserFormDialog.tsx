
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserFormContent from './user-form/UserFormContent';
import { UserFormValues } from './user-form/UserFormSchema';
import { Department } from '../hooks/user-data/useFetchDepartments';
import { Role } from '../hooks/user-data/useFetchRoles';
import { useUserForm } from '../hooks/user-form/useUserForm';
import { toast } from "sonner";

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
}

const UserFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentUser,
  isLoading,
  departments,
  roles
}: UserFormDialogProps) => {
  // 使用ref标记表单是否已提交，防止重复提交
  const isSubmitting = useRef(false);
  // 本地状态跟踪表单提交状态
  const [isSubmittingState, setIsSubmittingState] = useState(false);
  
  // 使用表单钩子
  const { form, handleSubmit, resetForm, isLocalLoading, setLocalLoading } = useUserForm(
    currentUser, 
    async (values) => {
      // 防止重复提交
      if (isSubmitting.current || isSubmittingState) {
        console.log("表单正在提交中，忽略重复请求");
        toast.info("正在处理，请稍候...");
        return false;
      }
      
      console.log("UserFormDialog - 提交表单开始", values);
      isSubmitting.current = true;
      setIsSubmittingState(true);
      setLocalLoading(true);
      toast.loading("正在保存用户数据...");
      
      try {
        // 提交表单
        const result = await onSubmit(values);
        console.log("UserFormDialog - 提交表单结果:", result);
        
        if (result) {
          // 提交成功，重置表单
          console.log("UserFormDialog - 提交成功，重置表单");
          resetForm();
          
          // 关闭对话框
          console.log("UserFormDialog - 关闭对话框");
          onOpenChange(false);
          
          // 显示成功消息
          toast.success(`用户${currentUser ? '更新' : '创建'}成功`);
          return true;
        } else {
          console.log("UserFormDialog - 提交失败");
          toast.error(`用户${currentUser ? '更新' : '创建'}失败`);
          return false;
        }
      } catch (error) {
        console.error("UserFormDialog - 提交表单出错:", error);
        toast.error(`操作失败: ${(error as Error).message}`);
        return false;
      } finally {
        // 无论成功还是失败，都重置提交状态和加载状态
        setTimeout(() => {
          isSubmitting.current = false;
          setIsSubmittingState(false);
          setLocalLoading(false);
          toast.dismiss(); // 清除所有loading toast
        }, 500);
      }
    }, 
    () => onOpenChange(false), 
    isLoading
  );

  // 处理对话框关闭
  const handleOpenChange = (open: boolean) => {
    // 如果正在提交，阻止关闭
    if ((isSubmitting.current || isSubmittingState) && open === false) {
      console.log("表单正在提交中，阻止关闭对话框");
      toast.info("表单正在提交中，请稍候...");
      return;
    }
    
    if (!open) {
      console.log("对话框关闭，重置表单");
      // 清除提交状态
      isSubmitting.current = false;
      setIsSubmittingState(false);
      // 重置表单
      resetForm();
    }
    
    onOpenChange(open);
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    if (isSubmitting.current || isSubmittingState) {
      console.log("表单正在提交中，阻止取消操作");
      toast.info("正在处理，请稍候...");
      return;
    }
    
    resetForm();
    onOpenChange(false);
  };

  // 综合加载状态
  const combinedLoading = isLoading || isLocalLoading || isSubmitting.current || isSubmittingState;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <UserFormContent
          form={form}
          onSubmit={handleSubmit}
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
