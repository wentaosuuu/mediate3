import { Input } from "@/components/ui/input";
import { VerificationCode } from "./VerificationCode";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="w-24 text-left text-sm font-medium text-text-primary">
          租户编号
        </label>
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
        <Input
          type="password"
          className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
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