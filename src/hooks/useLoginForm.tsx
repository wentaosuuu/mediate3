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

    if (!formData.tenantId || !formData.username || !formData.password || !formData.captcha) {
      toast.error("请填写完整信息");
      return;
    }

    if (formData.captcha !== verificationCode) {
      toast.error("验证码错误");
      return;
    }

    try {
      // 确保用户名和租户ID都是小写的
      const cleanUsername = formData.username.toLowerCase().trim();
      const cleanTenantId = formData.tenantId.toLowerCase().trim();
      
      // 构建登录邮箱
      const email = `${cleanUsername}.${cleanTenantId}@tenant.com`;

      console.log("Attempting login with email:", email); // Debug log

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError); // Debug log
        
        if (signInError.message.includes("Invalid login credentials")) {
          toast.error("用户名或密码错误", {
            position: "top-center",
          });
        } else {
          toast.error("登录失败，请重试", {
            position: "top-center",
          });
        }
        return;
      }

      if (!signInData.user) {
        toast.error("登录失败，未能获取用户信息", {
          position: "top-center",
        });
        return;
      }

      toast.success("登录成功", {
        position: "top-center",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login attempt failed:", error);
      toast.error("登录失败，请重试", {
        position: "top-center",
      });
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