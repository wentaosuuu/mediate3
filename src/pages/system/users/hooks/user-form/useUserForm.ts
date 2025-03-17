
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { userFormSchema, UserFormValues } from '../../components/user-form/UserFormSchema';
import { toast } from "sonner";

// 处理用户表单的钩子
export const useUserForm = (
  currentUser: any | null,
  onSubmit: (values: UserFormValues) => Promise<boolean>,
  onCloseDialog: () => void,
  isLoading: boolean
) => {
  const { toast: uiToast } = useToast();
  const isSubmitting = useRef(false);

  // 表单初始化
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      phone: "",
      department_id: "",
      role_id: "",
      password: "",
      tenant_id: "default", // 在实际应用中应该从系统或登录用户获取
      __isEditMode: false // 默认为创建模式
    }
  });

  // 当currentUser改变时重置表单
  useEffect(() => {
    if (currentUser === null) {
      console.log("重置表单为创建模式");
      form.reset({
        username: "",
        name: "",
        email: "",
        phone: "",
        department_id: "",
        role_id: "",
        password: "",
        tenant_id: "default",
        __isEditMode: false
      });
    } else {
      console.log("重置表单为编辑模式:", currentUser);
      
      // 确保从currentUser中获取正确的部门ID和角色ID
      form.reset({
        username: currentUser.username || "",
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        department_id: currentUser.department_id || "",
        role_id: currentUser.role_id || "",
        password: "",  // 编辑模式不需要密码
        tenant_id: currentUser.tenant_id || "default",
        __isEditMode: true // 标记为编辑模式
      });

      // 调试数据
      console.log("设置表单值后，form.getValues():", form.getValues());
    }
  }, [currentUser, form]);

  // 处理表单提交
  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("提交表单数据:", values);
    if (isLoading || isSubmitting.current) {
      console.log("系统正在处理中，请稍候");
      toast.info("系统正在处理中，请稍候");
      return; // 防止重复提交
    }
    
    try {
      console.log("开始提交表单");
      isSubmitting.current = true;
      toast.loading("正在处理...");
      
      // 移除临时标记字段，不需要提交到服务器
      const { __isEditMode, ...submitValues } = values;
      
      console.log("处理的表单数据:", submitValues, "当前用户:", currentUser);
      const success = await onSubmit(submitValues);
      
      if (success) {
        console.log("表单提交成功，关闭对话框");
        form.reset(); // 重置表单
        // 成功后关闭对话框
        onCloseDialog();
        
        toast.success(currentUser ? "更新用户成功" : "创建用户成功");
        uiToast({
          title: currentUser ? "更新用户成功" : "创建用户成功",
          description: `操作已完成`,
        });
      } else {
        console.error("表单提交返回失败");
        toast.error("操作失败，请检查输入并重试");
        uiToast({
          title: "操作失败",
          description: "请检查输入并重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("表单提交失败:", error);
      toast.error(`操作失败: ${(error as Error).message}`);
      uiToast({
        title: "操作失败",
        description: `${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      isSubmitting.current = false;
    }
  });

  // 重置表单
  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    handleSubmit,
    resetForm
  };
};
