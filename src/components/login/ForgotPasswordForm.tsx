import { Button } from "@/components/ui/button";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
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
          onClick={onBack}
        >
          返回登录
        </Button>
      </div>
    </div>
  );
};