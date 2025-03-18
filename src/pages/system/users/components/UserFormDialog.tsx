import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserFormContent from './user-form/UserFormContent';
import { UserFormValues } from './user-form/UserFormSchema';
import { Department } from '../hooks/user-data/useFetchDepartments';
import { Role } from '../hooks/user-data/useFetchRoles';
import { useUserForm } from '../hooks/user-form/useUserForm';
import { toast } from "sonner";
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
  
  // 使用表单钩子
  const { form, handleSubmit: _handleSubmit, resetForm, isLocalLoading, setLocalLoading } = useUserForm(
    currentUser, 
    async (values) => {
      // 防止重复提交 - 如果已经在提交中，直接返回
      if (isSubmitting.current) {
        logger.info("表单正在提交中，忽略重复请求");
        toast.info("正在处理，请稍候...");
        return false;
      }
      
      // 记录表单提交开始，并设置提交状态
      logger.info("UserFormDialog - 开始提交表单，数据:", values);      
      isSubmitting.current = true;
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
        
        logger.info("处理后的提交数据:", processedValues);
        
        // 调用外部onSubmit函数处理表单数据
        const result = await onSubmit(processedValues);
        logger.info("UserFormDialog - 提交表单结果:", result);
        
        if (result) {
          // 提交成功
          toast.success(`用户${currentUser ? '更新' : '创建'}成功`, { id: toastId });
          
          // 重置表单并关闭对话框（添加延迟以便用户看到成功消息）
          setTimeout(() => {
            resetForm();
            onOpenChange(false);
          }, 500);
          
          return true;
        } else {
          logger.warn("UserFormDialog - 提交失败");
          toast.error(`用户${currentUser ? '更新' : '创建'}失败`, { id: toastId });
          return false;
        }
      } catch (error) {
        logger.error("UserFormDialog - 提交表单出错:", error);
        toast.error(`操作失败: ${(error as Error).message}`);
        return false;
      } finally {
        // 延迟清理提交状态以防止快速点击导致的重复提交
        setTimeout(() => {
          isSubmitting.current = false;
          setLocalLoading(false);
        }, 800);
      }
    }, 
    () => onOpenChange(false), 
    externalLoading
  );

  // 修改表单提交处理
  const handleFormSubmit = async (values: UserFormValues): Promise<boolean> => {
    // 防止重复提交
    if (isSubmitting.current) {
      logger.info("表单正在提交中，忽略重复请求");
      toast.info("正在处理，请稍候...");
      return false;
    }
    
    // 记录表单提交开始，并设置提交状态
    logger.info("UserFormDialog - 开始提交表单，数据:", values);      
    isSubmitting.current = true;
    setLocalLoading(true);
    
    try {
      const toastId = `user-submit-${Date.now()}`;
      toast.loading("正在保存用户数据...", { id: toastId });
      
      // 确保department_id和role_id有有效值
      const processedValues = {
        ...values,
        department_id: values.department_id === "none" ? "" : values.department_id,
        role_id: values.role_id === "none" ? "" : values.role_id,
      };
      
      logger.info("处理后的提交数据:", processedValues);
      
      // 调用外部onSubmit函数
      const result = await onSubmit(processedValues);
      logger.info("UserFormDialog - 提交表单结果:", result);
      
      if (result) {
        toast.success(`用户${currentUser ? '更新' : '创建'}成功`, { id: toastId });
        // 添加延迟以便用户看到成功消息
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 500);
        return true;
      } else {
        logger.warn("UserFormDialog - 提交失败");
        toast.error(`用户${currentUser ? '更新' : '创建'}失败`, { id: toastId });
        return false;
      }
    } catch (error) {
      logger.error("UserFormDialog - 提交表单出错:", error);
      toast.error(`操作失败: ${(error as Error).message}`);
      return false;
    } finally {
      setTimeout(() => {
        isSubmitting.current = false;
        setLocalLoading(false);
      }, 800);
    }
  };

  // 处理对话框关闭
  const handleOpenChange = (open: boolean) => {
    // 如果正在提交，阻止关闭
    if (isSubmitting.current && open === false) {
      logger.info("表单正在提交中，阻止关闭对话框");
      toast.info("表单正在提交中，请稍候...");
      return;
    }
    
    if (!open) {
      logger.info("对话框关闭，重置表单");
      // 清除提交状态
      isSubmitting.current = false;
      // 重置表单
      resetForm();
    }
    
    onOpenChange(open);
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    if (isSubmitting.current) {
      logger.info("表单正在提交中，阻止取消操作");
      toast.info("正在处理，请稍候...");
      return;
    }
    
    resetForm();
    onOpenChange(false);
  };

  // 综合加载状态
  const combinedLoading = externalLoading || isLocalLoading || isSubmitting.current;

  // 每次打开对话框时，确保表单数据正确
  useEffect(() => {
    if (isOpen && currentUser) {
      logger.info("对话框已打开，当前用户:", currentUser);
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
