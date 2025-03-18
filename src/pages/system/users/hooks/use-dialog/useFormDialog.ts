
import { useRef, useState } from 'react';
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { toast } from "sonner";
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("useFormDialog");

/**
 * 表单对话框钩子
 * 负责处理对话框的开关状态、提交状态以及错误处理
 */
export const useFormDialog = (
  onOpenChange: (open: boolean) => void,
  onSubmit: (values: UserFormValues) => Promise<boolean>,
  resetForm: () => void,
  isExternalLoading: boolean
) => {
  // 使用ref标记表单是否已提交，防止重复提交
  const isSubmitting = useRef(false);
  
  // 本地加载状态
  const [isLocalLoading, setLocalLoading] = useState(false);
  
  // 综合加载状态
  const isLoading = isExternalLoading || isLocalLoading || isSubmitting.current;

  // 处理对话框关闭
  const handleOpenChange = (open: boolean) => {
    // 如果正在提交，阻止关闭
    if (isSubmitting.current && open === false) {
      logger.info("表单正在提交中，阻止关闭对话框");
      toast.info("表单正在提交中，请稍候...", {
        style: { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #7DD3FC' }
      });
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
      toast.info("正在处理，请稍候...", {
        style: { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #7DD3FC' }
      });
      return;
    }
    
    resetForm();
    onOpenChange(false);
  };

  // 处理表单提交
  const handleFormSubmit = async (values: UserFormValues): Promise<boolean> => {
    // 防止重复提交
    if (isSubmitting.current) {
      logger.info("表单正在提交中，忽略重复请求");
      toast.info("正在处理，请稍候...", {
        style: { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #7DD3FC' }
      });
      return false;
    }
    
    // 记录表单提交开始，并设置提交状态
    logger.info("开始提交表单，数据:", values);      
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
      logger.info("提交表单结果:", result);
      
      if (result) {
        // 成功提示 - 绿色背景
        toast.success("用户保存成功", { 
          id: toastId,
          style: { backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' } 
        });
        // 添加延迟以便用户看到成功消息
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 500);
        return true;
      } else {
        logger.warn("提交失败");
        // 失败提示 - 红色背景
        toast.error("用户保存失败", { 
          id: toastId,
          style: { backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #F87171' } 
        });
        return false;
      }
    } catch (error) {
      logger.error("提交表单出错:", error);
      // 错误提示 - 红色背景
      toast.error(`操作失败: ${(error as Error).message}`, {
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #F87171' }
      });
      return false;
    } finally {
      setTimeout(() => {
        isSubmitting.current = false;
        setLocalLoading(false);
      }, 800);
    }
  };

  return {
    isLoading,
    isLocalLoading,
    setLocalLoading,
    handleOpenChange,
    handleCancel,
    handleFormSubmit
  };
};
