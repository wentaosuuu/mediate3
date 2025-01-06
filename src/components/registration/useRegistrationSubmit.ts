import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationFormData } from "@/types/registration";
import { useToast } from "@/hooks/use-toast";
import { validateForm } from "./RegistrationValidation";
import { createTenantRegistration } from "./utils/createUserData";

export const useRegistrationSubmit = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const { toast } = useToast();

  const checkUsernameExists = async (username: string) => {
    const { data, error } = await supabase
      .from('tenant_registrations')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Username check error:', error);
      return true;
    }

    return data !== null;
  };

  const handleSubmit = async (
    formData: RegistrationFormData,
    setFormData: (data: RegistrationFormData) => void
  ) => {
    try {
      // 验证表单
      const validationError = validateForm(formData);
      if (validationError) {
        toast({
          title: "错误",
          description: validationError,
          variant: "destructive",
        });
        return;
      }

      // 检查用户名是否已存在
      const usernameExists = await checkUsernameExists(formData.username);
      if (usernameExists) {
        toast({
          title: "错误",
          description: "该用户名已被使用，请选择其他用户名",
          variant: "destructive",
        });
        return;
      }

      // 生成租户ID和邮箱
      const generatedTenantId = Math.floor(10000 + Math.random() * 90000).toString();
      const email = formData.businessEmail || `${formData.username}@${generatedTenantId}.com`;

      // 1. 创建认证用户并等待完成
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: formData.password,
      });

      if (authError || !authData.user) {
        console.error('Auth error:', authError);
        toast({
          title: "注册失败",
          description: "创建用户账户时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 等待一小段时间确保auth用户创建完成
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. 创建租户注册记录
      const { error: registrationError } = await createTenantRegistration(
        formData,
        generatedTenantId
      );

      if (registrationError) {
        console.error('Registration error:', registrationError);
        toast({
          title: "注册失败",
          description: "创建租户信息时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 3. 创建用户记录
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          tenant_id: generatedTenantId,
          username: formData.username,
          phone: formData.phone,
          email
        }]);

      if (userError) {
        console.error('User creation error:', userError);
        toast({
          title: "注册失败",
          description: "创建用户记录时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 注册成功，显示成功对话框
      setTenantId(generatedTenantId);
      setShowSuccessDialog(true);

      // 清空表单
      setFormData({
        contactPerson: "",
        phone: "",
        companyName: "",
        inviteCode: "",
        username: "",
        password: "",
        confirmPassword: "",
        socialCreditCode: "",
        address: "",
        companyIntro: "",
        remarks: "",
        businessEmail: "",
      });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "注册失败",
        description: "注册过程中发生错误，请稍后重试",
        variant: "destructive",
      });
    }
  };

  return {
    showSuccessDialog,
    setShowSuccessDialog,
    tenantId,
    handleSubmit
  };
};