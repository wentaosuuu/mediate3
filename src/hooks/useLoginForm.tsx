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
      
      // 先检查租户是否存在
      let { data: tenantExists, error: tenantError } = await supabase
        .from('tenant_registrations')
        .select('tenant_id')
        .eq('tenant_id', cleanTenantId)
        .maybeSingle();

      if (tenantError) {
        console.error('租户查询错误:', tenantError);
        toast.error("系统错误，请稍后重试", { position: "top-center" });
        return;
      }

      if (!tenantExists) {
        toast.error("租户编号不存在", { position: "top-center" });
        return;
      }

      // 检查用户是否存在于该租户下
      let { data: userExists, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('tenant_id', cleanTenantId)
        .eq('username', cleanUsername)
        .maybeSingle();

      if (userError) {
        console.error('用户查询错误:', userError);
        toast.error("系统错误，请稍后重试", { position: "top-center" });
        return;
      }

      if (!userExists) {
        toast.error("用户名不存在", { position: "top-center" });
        return;
      }

      // 构造登录邮箱
      const email = `${cleanUsername}.${cleanTenantId}@tenant.com`;

      // 尝试登录
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) {
        console.error('登录错误:', signInError);
        if (signInError.message.includes("Invalid login credentials")) {
          toast.error("密码错误", { position: "top-center" });
        } else {
          toast.error("登录失败，请稍后重试", { position: "top-center" });
        }
        return;
      }

      if (!data.user) {
        toast.error("登录失败", { position: "top-center" });
        return;
      }

      toast.success("登录成功", { position: "top-center" });
      navigate("/dashboard");
      
    } catch (error) {
      console.error("登录失败:", error);
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