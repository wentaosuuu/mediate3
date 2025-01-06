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
      // 1. 首先检查用户名是否存在于租户注册表中
      const { data: registrationData, error: registrationError } = await supabase
        .from("tenant_registrations")
        .select("*")
        .eq("tenant_id", formData.tenantId)
        .eq("username", formData.username)
        .maybeSingle();

      if (registrationError) {
        console.error("Registration fetch error:", registrationError);
        toast.error("验证用户信息失败", {
          position: "top-center",
        });
        return;
      }

      if (!registrationData) {
        toast.error("用户名或租户编号不存在", {
          position: "top-center",
        });
        return;
      }

      // 2. 然后获取用户记录
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
        console.error("User not found in users table");
        toast.error("用户数据不完整，请联系管理员", {
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