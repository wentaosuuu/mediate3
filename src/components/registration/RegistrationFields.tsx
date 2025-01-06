import { Input } from "@/components/ui/input";
import { RegistrationFormData } from "@/types/registration";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface RegistrationFieldsProps {
  formData: RegistrationFormData;
  onChange: (field: keyof RegistrationFormData, value: string) => void;
}

export const RegistrationFields = ({ formData, onChange }: RegistrationFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="联系人*"
          value={formData.contactPerson}
          onChange={(e) => onChange("contactPerson", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="tel"
          placeholder="联系电话*"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="企业名称*"
          value={formData.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="邀请码*"
          value={formData.inviteCode}
          onChange={(e) => onChange("inviteCode", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="用户名*"
          value={formData.username}
          onChange={(e) => onChange("username", e.target.value)}
        />
      </div>
      
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="密码*"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="确认密码*"
          value={formData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="统一社会信用代码*"
          value={formData.socialCreditCode}
          onChange={(e) => onChange("socialCreditCode", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="地址"
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="公司简介"
          value={formData.companyIntro}
          onChange={(e) => onChange("companyIntro", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="备注"
          value={formData.remarks}
          onChange={(e) => onChange("remarks", e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="email"
          placeholder="企业邮箱"
          value={formData.businessEmail}
          onChange={(e) => onChange("businessEmail", e.target.value)}
        />
      </div>
    </div>
  );
};