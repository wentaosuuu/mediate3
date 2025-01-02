export interface RegistrationFormData {
  contactPerson: string;
  phone: string;
  companyName: string;
  inviteCode: string;
  username: string;
  password: string;
  confirmPassword: string;
  socialCreditCode: string;
  address?: string;
  companyIntro?: string;
  remarks?: string;
  businessEmail?: string;
}