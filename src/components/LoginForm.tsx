import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    tenantId: "",
    username: "",
    password: "",
    captcha: "",
    remember: false,
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantId || !formData.username || !formData.password || !formData.captcha) {
      toast({
        title: "错误",
        description: "请填写完整信息",
        variant: "destructive",
      });
      return;
    }
    // TODO: 实现登录逻辑
    console.log("登录信息:", formData);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
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

          <div className="flex flex-col items-center gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleBackToLogin}
            >
              返回登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">欢迎使用法调云</h1>
        <p className="text-text-secondary mt-2">请登录您的账号</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="租户编号"
            value={formData.tenantId}
            onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="用户名/手机号"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="密码"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="验证码"
            value={formData.captcha}
            onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
          />
          <div className="w-32 h-10 bg-gray-100 flex items-center justify-center">
            验证码图片
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-text-secondary">记住密码</span>
        </label>
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-primary hover:text-primary-hover"
        >
          忘记密码？
        </button>
      </div>

      <Button type="submit" className="w-full">
        登录
      </Button>

      <div className="text-center text-sm text-text-secondary">
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