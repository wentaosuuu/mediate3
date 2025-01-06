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

  const validateForm = () => {
    if (!formData.tenantId.trim()) {
      toast.error("请输入租户编号", { position: "top-center" });
      return false;
    }
    if (!formData.username.trim()) {
      toast.error("请输入用户名", { position: "top-center" });
      return false;
    }
    if (!formData.password) {
      toast.error("请输入密码", { position: "top-center" });
      return false;
    }
    if (!formData.captcha) {
      toast.error("请输入验证码", { position: "top-center" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.captcha !== verificationCode) {
      toast.error("验证码错误，请重新输入", { position: "top-center" });
      return;
    }

    try {
      const cleanUsername = formData.username.toLowerCase().trim();
      const cleanTenantId = formData.tenantId.toLowerCase().trim();
      const email = `${cleanUsername}.${cleanTenantId}@tenant.com`;

      console.log("Attempting login with email:", email);

      // First check if the tenant exists
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenant_registrations')
        .select('tenant_id')
        .eq('tenant_id', cleanTenantId)
        .single();

      if (!tenantData) {
        toast.error("租户编号不存在，请检查后重试", { position: "top-center" });
        return;
      }

      // Then attempt to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        
        // Check specific error cases
        if (signInError.message.includes("Invalid login credentials")) {
          // Check if user exists first
          const { data: userData } = await supabase
            .from('users')
            .select('username')
            .eq('tenant_id', cleanTenantId)
            .eq('username', cleanUsername)
            .single();

          if (!userData) {
            toast.error("用户名不存在，请检查后重试", { position: "top-center" });
          } else {
            toast.error("密码错误，请重新输入", { position: "top-center" });
          }
        } else {
          toast.error("登录失败，请稍后重试", { position: "top-center" });
        }
        return;
      }

      if (!signInData.user) {
        toast.error("登录失败，未能获取用户信息", { position: "top-center" });
        return;
      }

      toast.success("登录成功", { position: "top-center" });
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login attempt failed:", error);
      toast.error("系统错误，请稍后重试", { position: "top-center" });
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