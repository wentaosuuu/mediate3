import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginHeader } from "./login/LoginHeader";
import { LoginFields } from "./login/LoginFields";
import { ForgotPasswordForm } from "./login/ForgotPasswordForm";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useEffect } from "react";

const LoginForm = () => {
  const {
    formData,
    verificationCode,
    showForgotPassword,
    setShowForgotPassword,
    handleFieldChange,
    handleSubmit,
    generateVerificationCode,
  } = useLoginForm();
  
  const navigate = useNavigate();

  useEffect(() => {
    generateVerificationCode();
  }, []);

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
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