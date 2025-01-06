import { RegistrationFormData } from "@/types/registration";

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "请输入密码";
  }
  if (password.length < 6) {
    return "密码长度至少需要6个字符";
  }
  return null;
};

export const validateForm = (formData: RegistrationFormData): string | null => {
  const requiredFields: Array<{
    key: keyof RegistrationFormData;
    label: string;
  }> = [
    { key: "contactPerson", label: "联系人" },
    { key: "phone", label: "联系电话" },
    { key: "companyName", label: "企业名称" },
    { key: "inviteCode", label: "邀请码" },
    { key: "username", label: "用户名" },
    { key: "password", label: "密码" },
    { key: "confirmPassword", label: "确认密码" },
    { key: "socialCreditCode", label: "统一社会信用代码" },
  ];

  // 检查必填字段
  for (const field of requiredFields) {
    if (!formData[field.key]) {
      return `请填写${field.label}`;
    }
  }

  // 验证密码
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    return passwordError;
  }

  // 验证密码确认
  if (formData.password !== formData.confirmPassword) {
    return "两次输入的密码不一致";
  }

  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formData.phone)) {
    return "请输入正确的手机号码";
  }

  return null;
};