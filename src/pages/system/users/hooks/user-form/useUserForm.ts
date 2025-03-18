
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { userFormSchema, UserFormValues } from "../../components/user-form/UserFormSchema";
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("useUserForm");

/**
 * 用户表单自定义钩子
 * 处理表单初始化和状态管理
 */
export const useUserForm = (currentUser: any | null) => {
  // 本地加载状态
  const [isLocalLoading, setLocalLoading] = useState(false);

  // 初始化表单
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      phone: "",
      department_id: "none",
      role_id: "none",
      tenant_id: "",
      __isEditMode: false
    }
  });

  // 重置表单函数
  const resetForm = () => {
    logger.info("重置表单");
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
  };

  return {
    form,
    resetForm,
    isLocalLoading,
    setLocalLoading
  };
};
