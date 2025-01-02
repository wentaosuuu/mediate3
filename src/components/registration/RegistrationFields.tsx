import { Input } from "@/components/ui/input";
import { RegistrationFormData } from "@/types/registration";

/**
 * 注册表单字段组件的属性接口
 */
interface RegistrationFieldsProps {
  formData: RegistrationFormData;  // 表单数据
  onChange: (field: keyof RegistrationFormData, value: string) => void;  // 字段变更处理函数
}

/**
 * 注册表单字段组件
 * 包含所有注册所需的输入字段
 */
export const RegistrationFields = ({ formData, onChange }: RegistrationFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* 联系人输入框 */}
      <div>
        <Input
          type="text"
          placeholder="联系人*"
          value={formData.contactPerson}
          onChange={(e) => onChange("contactPerson", e.target.value)}
        />
      </div>
      
      {/* 联系电话输入框 */}
      <div>
        <Input
          type="tel"
          placeholder="联系电话*"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      
      {/* 企业名称输入框 */}
      <div>
        <Input
          type="text"
          placeholder="企业名称*"
          value={formData.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
        />
      </div>
      
      {/* 邀请码输入框 */}
      <div>
        <Input
          type="text"
          placeholder="邀请码*"
          value={formData.inviteCode}
          onChange={(e) => onChange("inviteCode", e.target.value)}
        />
      </div>
      
      {/* 用户名输入框 */}
      <div>
        <Input
          type="text"
          placeholder="用户名*"
          value={formData.username}
          onChange={(e) => onChange("username", e.target.value)}
        />
      </div>
      
      {/* 密码输入框 */}
      <div>
        <Input
          type="password"
          placeholder="密码*"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
      </div>
      
      {/* 确认密码输入框 */}
      <div>
        <Input
          type="password"
          placeholder="确认密码*"
          value={formData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
        />
      </div>
      
      {/* 统一社会信用代码输入框 */}
      <div>
        <Input
          type="text"
          placeholder="统一社会信用代码*"
          value={formData.socialCreditCode}
          onChange={(e) => onChange("socialCreditCode", e.target.value)}
        />
      </div>
      
      {/* 地址输入框（选填） */}
      <div>
        <Input
          type="text"
          placeholder="地址"
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      
      {/* 公司简介输入框（选填） */}
      <div>
        <Input
          type="text"
          placeholder="公司简介"
          value={formData.companyIntro}
          onChange={(e) => onChange("companyIntro", e.target.value)}
        />
      </div>
      
      {/* 备注输入框（选填） */}
      <div>
        <Input
          type="text"
          placeholder="备注"
          value={formData.remarks}
          onChange={(e) => onChange("remarks", e.target.value)}
        />
      </div>
      
      {/* 企业邮箱输入框（选填） */}
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