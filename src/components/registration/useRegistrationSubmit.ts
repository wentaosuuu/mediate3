import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationFormData } from "@/types/registration";
import { useToast } from "@/hooks/use-toast";
import { validateForm } from "./RegistrationValidation";

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

  const handleSubmit = async (formData: RegistrationFormData, setFormData: (data: RegistrationFormData) => void) => {
    const validationError = validateForm(formData);
    if (validationError) {
      toast({
        title: "错误",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const usernameExists = await checkUsernameExists(formData.username);
    if (usernameExists) {
      toast({
        title: "错误",
        description: "该用户名已被使用，请选择其他用户名",
        variant: "destructive",
      });
      return;
    }

    try {
      const generatedTenantId = Math.floor(10000 + Math.random() * 90000).toString();
      const email = formData.businessEmail || `${formData.username}@${generatedTenantId}.com`;
      
      // 1. 创建 Supabase Auth 用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: formData.password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "注册失败",
          description: "创建用户账户时发生错误",
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        console.error('No user data returned from auth signup');
        toast({
          title: "注册失败",
          description: "创建用户账户时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 2. 创建租户注册记录
      const { error: registrationError } = await supabase
        .from('tenant_registrations')
        .insert([{
          tenant_id: generatedTenantId,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          company_name: formData.companyName,
          username: formData.username,
          social_credit_code: formData.socialCreditCode,
          address: formData.address || null,
          company_intro: formData.companyIntro || null,
          remarks: formData.remarks || null,
          business_email: formData.businessEmail || null,
        }]);

      if (registrationError) {
        console.error('Registration error:', registrationError);
        await supabase.auth.admin.deleteUser(authData.user.id);
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
          email: email
        }]);

      if (userError) {
        console.error('User creation error:', userError);
        await supabase.auth.admin.deleteUser(authData.user.id);
        await supabase
          .from('tenant_registrations')
          .delete()
          .eq('tenant_id', generatedTenantId);

        toast({
          title: "注册失败",
          description: "创建用户记录时发生错误",
          variant: "destructive",
        });
        return;
      }

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