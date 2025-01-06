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
      // 1. First get the user record to find their email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("tenant_id", formData.tenantId)
        .eq("username", formData.username)
        .single();

      if (userError || !userData?.email) {
        console.error("User fetch error:", userError);
        toast.error("用户名或租户编号不正确");
        return;
      }

      // 2. Try to sign in with email and password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        toast.error("密码错误");
        return;
      }

      toast.success("登录成功");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login error:", error);
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