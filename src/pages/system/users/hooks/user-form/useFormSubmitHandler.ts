
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
  onSubmit: (values: UserFormValues) => Promise<boolean>,
  isLoading: boolean
) => {
  // 本地提交状态，避免多次点击提交按钮
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表单提交处理函数
  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认提交行为
    
    // 如果正在加载或已经在提交中，阻止重复提交
    if (isLoading || isSubmitting) {
      logger.info("表单处于加载或提交状态，忽略重复提交请求");
      toast.info("正在处理，请稍候...");
      return;
    }

    try {
      // 获取表单数据
      const formValues = form.getValues();
      logger.info("开始表单提交流程");
      logger.info("表单数据:", formValues);

      // 设置本地提交状态
      setIsSubmitting(true);
      
      // 确保特殊值处理
      const processedValues = {
        ...formValues,
        department_id: formValues.department_id === "none" ? "" : formValues.department_id,
        role_id: formValues.role_id === "none" ? "" : formValues.role_id,
      };
      
      logger.info("处理后的提交数据:", processedValues);
      
      // 调用外部提交函数
      const success = await onSubmit(processedValues);
      logger.info("表单提交结果:", success);
      
      if (success) {
        // 提交成功，显示成功提示
        toast.success("保存成功");
        return true;
      } else {
        // 提交失败，显示错误提示
        toast.error("保存失败，请重试");
        return false;
      }
    } catch (error) {
      logger.error("表单提交过程中出错:", error);
      toast.error(`提交失败: ${(error as Error).message}`);
      return false;
    } finally {
      // 延迟重置提交状态，避免快速重复点击
      setTimeout(() => {
        setIsSubmitting(false);
      }, 800);
    }
  }, [form, onSubmit, isLoading, isSubmitting]);

  return {
    handleFormSubmit,
    isSubmitting
  };
};
