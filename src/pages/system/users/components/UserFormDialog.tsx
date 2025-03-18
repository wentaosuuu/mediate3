
import React, { useRef, useState, useEffect } from 'react';
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
  isLoading: externalLoading,
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
      
      // 记录表单提交开始
      console.log("UserFormDialog - 提交表单开始，数据:", values);
      
      // 设置提交状态
      isSubmitting.current = true;
      setIsSubmittingState(true);
      setLocalLoading(true);
      
      try {
        // 显示提交中的提示
        const toastId = `user-submit-${Date.now()}`;
        toast.loading("正在保存用户数据...", { id: toastId });
        
        // 确保department_id和role_id有有效值（转换"none"为空字符串）
        const processedValues = {
          ...values,
          department_id: values.department_id === "none" ? "" : values.department_id,
          role_id: values.role_id === "none" ? "" : values.role_id,
        };
        
        console.log("处理后的提交数据:", processedValues);
        
        // 调用外部onSubmit函数处理表单数据
        const result = await onSubmit(processedValues);
        console.log("UserFormDialog - 提交表单结果:", result);
        
        if (result) {
          // 提交成功，显示成功消息
          toast.success(`用户${currentUser ? '更新' : '创建'}成功`, { id: toastId });
          
          // 重置表单
          resetForm();
          
          // 关闭对话框（延迟以便用户看到成功消息）
          setTimeout(() => {
            onOpenChange(false);
          }, 500);
          
          return true;
        } else {
          console.log("UserFormDialog - 提交失败");
          toast.error(`用户${currentUser ? '更新' : '创建'}失败`, { id: toastId });
          return false;
        }
      } catch (error) {
        console.error("UserFormDialog - 提交表单出错:", error);
        toast.error(`操作失败: ${(error as Error).message}`);
        return false;
      } finally {
        // 延迟清理提交状态
        setTimeout(() => {
          isSubmitting.current = false;
          setIsSubmittingState(false);
          setLocalLoading(false);
        }, 800);
      }
    }, 
    () => onOpenChange(false), 
    externalLoading
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
  const combinedLoading = externalLoading || isLocalLoading || isSubmitting.current || isSubmittingState;

  // 每次打开对话框时，确保表单数据正确
  useEffect(() => {
    if (isOpen && currentUser) {
      console.log("对话框已打开，当前用户:", currentUser);
      // 处理表单数据 - 特别注意none值的处理
      form.reset({
        username: currentUser.username || "",
        email: currentUser.email || "",
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        department_id: currentUser.department_id === "" ? "none" : currentUser.department_id,
        role_id: currentUser.role_id === "" ? "none" : currentUser.role_id,
        tenant_id: currentUser.tenant_id || "",
        __isEditMode: true
      });
    }
  }, [isOpen, currentUser, form]);

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
