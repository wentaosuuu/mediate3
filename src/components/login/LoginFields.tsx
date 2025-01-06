import { Input } from "@/components/ui/input";
import { VerificationCode } from "./VerificationCode";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoginFieldsProps {
  formData: {
    tenantId: string;
    username: string;
    password: string;
    captcha: string;
  };
  verificationCode: string;
  onRefreshCode: () => void;
  onChange: (field: string, value: string) => void;
}

export const LoginFields = ({
  formData,
  verificationCode,
  onRefreshCode,
  onChange,
}: LoginFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 text-left flex items-center gap-1">
          <label className="text-sm font-medium text-text-primary">
            租户编号
          </label>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>如忘记租户编号，请联系业务经理找回</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          type="text"
          className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
          value={formData.tenantId}
          onChange={(e) => onChange("tenantId", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-24 text-left text-sm font-medium text-text-primary">
          用户名/手机号
        </label>
        <Input
          type="text"
          className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
          value={formData.username}
          onChange={(e) => onChange("username", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-24 text-left text-sm font-medium text-text-primary">
          密码
        </label>
        <div className="flex-1 relative">
          <Input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-full border-gray-300 focus:border-primary focus:ring-primary pr-10"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-24 text-left text-sm font-medium text-text-primary">
          验证码
        </label>
        <div className="flex-1 flex gap-4">
          <Input
            type="text"
            className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
            value={formData.captcha}
            onChange={(e) => onChange("captcha", e.target.value)}
          />
          <VerificationCode code={verificationCode} onRefresh={onRefreshCode} />
        </div>
      </div>
    </div>
  );
};