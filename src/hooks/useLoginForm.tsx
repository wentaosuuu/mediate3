import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenantId: "",
    username: "",
    password: "",
    captcha: "",
    remember: false,
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.tenantId || !formData.username || !formData.password || !formData.captcha) {
      toast.error("请填写完整信息");
      return;
    }

    // Verify captcha
    if (formData.captcha !== verificationCode) {
      toast.error("验证码错误");
      return;
    }

    try {
      // 1. First check if the tenant registration exists and get the email
      const { data: registrationData, error: registrationError } = await supabase
        .from("tenant_registrations")
        .select("business_email")
        .eq("tenant_id", formData.tenantId)
        .eq("username", formData.username)
        .single();

      if (registrationError || !registrationData) {
        console.error("Registration check error:", registrationError);
        toast.error("用户名或租户编号不正确");
        return;
      }

      if (!registrationData.business_email) {
        console.error("No business email found for user");
        toast.error("账户邮箱未设置，请联系管理员");
        return;
      }

      // 2. Try to sign in with email and password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: registrationData.business_email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        
        // Check if the user exists in Supabase Auth
        const { data: userExists } = await supabase.auth.admin.getUserByEmail(registrationData.business_email);
        
        if (!userExists) {
          console.error("User does not exist in Supabase Auth");
          toast.error("账户未激活，请联系管理员");
          return;
        }

        toast.error("密码错误，请重试");
        return;
      }

      if (!signInData.user) {
        toast.error("登录失败，未能获取用户信息");
        return;
      }

      // 3. After successful login, check if we need to create/update the users record
      const { error: userError } = await supabase
        .from("users")
        .upsert({
          id: signInData.user.id,
          tenant_id: formData.tenantId,
          username: formData.username,
          email: registrationData.business_email,
        }, {
          onConflict: 'id'
        });

      if (userError) {
        console.error("Error updating user record:", userError);
        // Don't block login if this fails
      }

      toast.success("登录成功");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login attempt failed:", error);
      toast.error("登录失败，请稍后重试");
    }
  };

  return {
    formData,
    verificationCode,
    showForgotPassword,
    setShowForgotPassword,
    handleFieldChange,
    handleSubmit,
    generateVerificationCode,
  };
};