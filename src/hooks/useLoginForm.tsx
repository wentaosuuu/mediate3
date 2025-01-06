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
      toast.error("请填写完整信息", {
        position: "top-center",
      });
      return;
    }

    if (formData.captcha !== verificationCode) {
      toast.error("验证码错误", {
        position: "top-center",
      });
      return;
    }

    try {
      // 1. 首先验证租户ID是否存在
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenant_registrations")
        .select("tenant_id")
        .eq("tenant_id", formData.tenantId)
        .maybeSingle();

      if (tenantError) {
        console.error("Tenant fetch error:", tenantError);
        toast.error("验证租户信息失败", {
          position: "top-center",
        });
        return;
      }

      if (!tenantData) {
        toast.error("租户编号不存在", {
          position: "top-center",
        });
        return;
      }

      // 2. 然后验证用户名是否存在于该租户下
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("tenant_id", formData.tenantId)
        .eq("username", formData.username)
        .maybeSingle();

      if (userError) {
        console.error("User fetch error:", userError);
        toast.error("验证用户信息失败", {
          position: "top-center",
        });
        return;
      }

      if (!userData) {
        toast.error("用户名不存在", {
          position: "top-center",
        });
        return;
      }

      // 3. 最后尝试登录
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        toast.error("密码错误", {
          position: "top-center",
        });
        return;
      }

      toast.success("登录成功", {
        position: "top-center",
      });
      
      // 登录成功后导航到首页
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("登录失败，请稍后重试", {
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