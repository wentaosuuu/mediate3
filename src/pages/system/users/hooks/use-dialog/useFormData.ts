
import { useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("useFormData");

/**
 * 表单数据处理钩子
 * 负责处理表单数据的初始化和更新
 */
export const useFormData = (
  form: UseFormReturn<UserFormValues>,
  currentUser: any | null,
  isOpen: boolean
) => {
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
    } else if (isOpen && !currentUser) {
      // 新建模式，重置表单为默认值
      logger.info("对话框已打开，新建用户模式");
      form.reset({
        username: "",
        email: "",
        name: "",
        phone: "",
        department_id: "none",
        role_id: "none",
        tenant_id: "",
        __isEditMode: false
      });
    }
  }, [isOpen, currentUser, form]);

  return {
    formData: form.getValues()
  };
};
