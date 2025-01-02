/**
 * 注册表单数据接口
 * 定义注册表单中所需的所有字段
 */
export interface RegistrationFormData {
  contactPerson: string;    // 联系人
  phone: string;           // 电话
  companyName: string;     // 公司名称
  inviteCode: string;      // 邀请码
  username: string;        // 用户名
  password: string;        // 密码
  confirmPassword: string; // 确认密码
  socialCreditCode: string;// 统一社会信用代码
  address?: string;        // 地址（可选）
  companyIntro?: string;   // 公司简介（可选）
  remarks?: string;        // 备注（可选）
  businessEmail?: string;  // 企业邮箱（可选）
}