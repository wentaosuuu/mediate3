export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "密码长度至少需要6个字符";
  }
  return null;
};

export const validateForm = (formData: {
  contactPerson: string;
  phone: string;
  companyName: string;
  inviteCode: string;
  username: string;
  password: string;
  confirmPassword: string;
  socialCreditCode: string;
}) => {
  const requiredFields = [
    "contactPerson",
    "phone",
    "companyName",
    "inviteCode",
    "username",
    "password",
    "confirmPassword",
    "socialCreditCode",
  ];

  const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
  
  if (missingFields.length > 0) {
    return "请填写所有必填项（带*号的字段）";
  }

  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    return passwordError;
  }

  if (formData.password !== formData.confirmPassword) {
    return "两次输入的密码不一致";
  }

  return null;
};