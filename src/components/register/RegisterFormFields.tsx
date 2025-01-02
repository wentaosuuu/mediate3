import { Input } from "@/components/ui/input";

interface RegisterFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

const RegisterFormFields = ({ formData, setFormData }: RegisterFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">联系人*</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">联系电话*</label>
        <Input
          type="tel"
          className="w-2/3 rounded-elliptical"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">企业名称*</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">邀请码*</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.inviteCode}
          onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">用户名*</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">密码*</label>
        <Input
          type="password"
          className="w-2/3 rounded-elliptical"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">确认密码*</label>
        <Input
          type="password"
          className="w-2/3 rounded-elliptical"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">统一社会信用代码*</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.socialCreditCode}
          onChange={(e) => setFormData({ ...formData, socialCreditCode: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">地址</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">公司简介</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.companyIntro}
          onChange={(e) => setFormData({ ...formData, companyIntro: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">备注</label>
        <Input
          type="text"
          className="w-2/3 rounded-elliptical"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="w-1/3 text-left text-text-secondary">企业邮箱</label>
        <Input
          type="email"
          className="w-2/3 rounded-elliptical"
          value={formData.businessEmail}
          onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
        />
      </div>
    </div>
  );
};

export default RegisterFormFields;