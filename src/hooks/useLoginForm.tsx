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

    // 基础表单验证
    if (!formData.tenantId || !formData.username || !formData.password || !formData.captcha) {
      toast.error("请填写完整信息");
      return;
    }

    // 验证码验证
    if (formData.captcha !== verificationCode) {
      toast.error("验证码错误");
      return;
    }

    try {
      // 1. 首先检查租户注册信息
      const { data: registrationData, error: registrationError } = await supabase
        .from("tenant_registrations")
        .select("business_email")
        .eq("tenant_id", formData.tenantId)
        .eq("username", formData.username)
        .single();

      if (registrationError) {
        console.error("Registration check error:", registrationError);
        toast.error("用户名或租户编号不正确");
        return;
      }

      // 生成登录邮箱
      const email = registrationData.business_email || `${formData.username}@${formData.tenantId}.com`;
      console.log("Attempting login with email:", email); // 添加日志

      // 2. 使用邮箱和密码登录
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        toast.error("登录失败，请检查密码是否正确");
        return;
      }

      if (!signInData.user) {
        toast.error("登录失败，未能获取用户信息");
        return;
      }

      // 3. 登录成功后更新用户记录
      const { error: userError } = await supabase
        .from("users")
        .upsert({
          id: signInData.user.id,
          tenant_id: formData.tenantId,
          username: formData.username,
          email: email,
        });

      if (userError) {
        console.error("Error updating user record:", userError);
        // 继续执行，不影响登录流程
      }

      toast.success("登录成功");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login attempt failed:", error);
      toast.error("登录失败，请重试");
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