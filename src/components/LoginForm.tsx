import { useState } from "react";
import { Input } from "@/components/ui/input";
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

/**
 * 登录表单组件
 * 处理用户登录流程，包括表单验证和提交
 */
const LoginForm = () => {
  // 表单数据状态
  const [formData, setFormData] = useState({
    tenantId: "",      // 租户ID
    username: "",      // 用户名
    password: "",      // 密码
    captcha: "",       // 验证码
    remember: false,   // 记住密码
  });

  // 控制忘记密码页面显示状态
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // 路由导航hook
  const navigate = useNavigate();

  /**
   * 处理表单提交
   * @param e 表单提交事件
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 验证必填字段
    if (!formData.tenantId || !formData.username || !formData.password || !formData.captcha) {
      toast("错误", {
        description: "请填写完整信息",
        position: "top-center",
      });
      return;
    }
    console.log("登录信息:", formData);
  };

  /**
   * 处理点击忘记密码
   */
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  /**
   * 处理返回登录页面
   */
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // 显示忘记密码页面
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

  // 显示登录表单
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 mx-auto">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">法调云</h1>
        <h2 className="text-2xl font-bold text-text-primary">欢迎使用法调云</h2>
      </div>
      
      {/* 表单字段 */}
      <div className="space-y-4">
        {/* 租户编号输入框 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-left text-sm font-medium text-text-primary flex items-center">
            租户编号
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="inline-block ml-1 w-4 h-4 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>如忘记租户编号，请联系业务经理找回</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Input
            type="text"
            className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
            value={formData.tenantId}
            onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
          />
        </div>
        
        {/* 用户名输入框 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-left text-sm font-medium text-text-primary">用户名/手机号</label>
          <Input
            type="text"
            className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        
        {/* 密码输入框 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-left text-sm font-medium text-text-primary">密码</label>
          <Input
            type="password"
            className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        
        {/* 验证码输入框 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-left text-sm font-medium text-text-primary">验证码</label>
          <div className="flex-1 flex gap-4">
            <Input
              type="text"
              className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
              value={formData.captcha}
              onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
            />
            <div className="w-32 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
              验证码图片
            </div>
          </div>
        </div>
      </div>

      {/* 记住密码和忘记密码 */}
      <div className="flex items-center justify-between text-sm mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
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

      {/* 登录按钮 */}
      <Button type="submit" className="w-full mt-6 rounded-full bg-primary hover:bg-primary-hover">
        登录
      </Button>

      {/* 注册链接 */}
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