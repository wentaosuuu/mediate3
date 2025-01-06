import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LoginHeader } from "./login/LoginHeader";
import { LoginFields } from "./login/LoginFields";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    tenantId: "",
    username: "",
    password: "",
    captcha: "",
    remember: false,
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Generate random 4-digit verification code
  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
  };

  useEffect(() => {
    generateVerificationCode();
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.tenantId || !formData.username || !formData.password || !formData.captcha) {
      toast.error("请填写完整信息");
      return;
    }

    // Validate verification code
    if (formData.captcha !== verificationCode) {
      toast.error("验证码错误");
      return;
    }

    try {
      // Check if tenant exists
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenant_registrations")
        .select("tenant_id")
        .eq("tenant_id", formData.tenantId)
        .single();

      if (tenantError || !tenantData) {
        toast.error("租户编号不存在");
        return;
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${formData.username}@${formData.tenantId}.com`,
        password: formData.password,
      });

      if (error) {
        toast.error("用户名或密码错误");
        return;
      }

      // Login successful
      toast.success("登录成功");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("登录失败，请稍后重试");
    }
  };

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">找回密码</h1>
          <p className="text-text-secondary mt-2">请联系您的业务经理</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-700">
              <span>⚠️</span>
              <p>为了保证您的账号安全，请联系您的业务经理重置密码。</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForgotPassword(false)}
          >
            返回登录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 mx-auto">
      <LoginHeader />
      
      <LoginFields
        formData={formData}
        verificationCode={verificationCode}
        onRefreshCode={generateVerificationCode}
        onChange={handleFieldChange}
      />

      <div className="flex items-center justify-between text-sm mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => handleFieldChange("remember", e.target.checked.toString())}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-text-secondary">记住密码</span>
        </label>
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-primary hover:text-primary-hover"
        >
          忘记密码？
        </button>
      </div>

      <Button type="submit" className="w-full mt-6 rounded-full bg-primary hover:bg-primary-hover">
        登录
      </Button>

      <div className="text-center text-sm text-text-secondary mt-4">
        还没有账号？{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-primary hover:text-primary-hover"
        >
          去注册一个
        </button>
      </div>
    </form>
  );
};

export default LoginForm;