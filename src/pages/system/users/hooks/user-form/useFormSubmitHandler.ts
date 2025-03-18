
import { useState, useCallback } from 'react';
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { toast } from "sonner";
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("FormSubmitHandler");

/**
 * 表单提交处理钩子
 * 处理表单提交逻辑、防止重复提交和数据预处理
 */
export const useFormSubmitHandler = (
  form: UseFormReturn<UserFormValues>,
  onSubmit: () => void,
  isLoading: boolean
) => {
  // 本地提交状态，避免多次点击提交按钮
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表单提交处理函数
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认提交行为
    
    // 如果正在加载或已经在提交中，阻止重复提交
    if (isLoading || isSubmitting) {
      logger.info("表单处于加载或提交状态，忽略重复提交请求");
      toast.info("正在处理，请稍候...");
      return;
    }
    
    // 设置本地提交状态
    setIsSubmitting(true);
    
    logger.info("表单提交被触发，准备处理数据");
    const formValues = form.getValues();
    logger.info("表单数据:", formValues);
    
    // 确保下拉菜单值正确处理
    if (formValues.department_id === undefined) {
      logger.info("部门ID未定义，设置为'none'");
      form.setValue('department_id', 'none');
    }
    if (formValues.role_id === undefined) {
      logger.info("角色ID未定义，设置为'none'");
      form.setValue('role_id', 'none');
    }
    
    logger.info("调用onSubmit处理表单提交");
    // 调用传入的onSubmit函数处理表单
    onSubmit();
    
    // 延迟重置提交状态，避免快速重复点击
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  }, [form, onSubmit, isLoading, isSubmitting]);

  return {
    handleFormSubmit,
    isSubmitting
  };
};
