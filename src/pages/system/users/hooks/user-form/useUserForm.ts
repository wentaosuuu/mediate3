
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { UserFormSchema, UserFormValues } from "../../components/user-form/UserFormSchema";

interface UseUserFormProps {
  currentUser: any | null;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * 用户表单自定义钩子
 * 处理表单初始化、验证和提交
 */
export const useUserForm = (
  currentUser: any | null,
  onSubmit: (values: UserFormValues) => Promise<boolean>,
  onCancel: () => void,
  isLoading: boolean
) => {
  // 本地加载状态
  const [isLocalLoading, setLocalLoading] = useState(false);

  // 初始化表单
  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      phone: "",
      department_id: "",
      role_id: "",
      tenant_id: "",
      __isEditMode: false
    }
  });

  // 表单提交处理
  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("表单提交开始，数据:", values);
    if (isLocalLoading || isLoading) {
      console.log("已处于加载状态，跳过重复提交");
      return;
    }
    
    setLocalLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLocalLoading(false);
    }
  });

  // 重置表单函数
  const resetForm = () => {
    console.log("重置表单");
    form.reset({
      username: "",
      email: "",
      name: "",
      phone: "",
      department_id: "",
      role_id: "",
      tenant_id: "",
      __isEditMode: false
    });
  };

  // 编辑模式下，设置表单初始值
  useEffect(() => {
    if (currentUser) {
      console.log("设置表单初始值，当前用户:", currentUser);
      form.reset({
        username: currentUser.username || "",
        email: currentUser.email || "",
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        department_id: currentUser.department_id || "",
        role_id: currentUser.role_id || "",
        tenant_id: currentUser.tenant_id || "",
        __isEditMode: true
      });
    } else {
      // 新建模式下重置表单
      console.log("新建模式，重置表单");
      resetForm();
    }
  }, [currentUser, form]);

  return {
    form,
    handleSubmit,
    resetForm,
    isLocalLoading,
    setLocalLoading
  };
};
