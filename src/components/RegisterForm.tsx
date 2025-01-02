import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RegisterHeader from "./register/RegisterHeader";
import RegisterFormFields from "./register/RegisterFormFields";
import SuccessDialog from "./register/SuccessDialog";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    contactPerson: "",
    phone: "",
    companyName: "",
    inviteCode: "",
    username: "",
    password: "",
    confirmPassword: "",
    socialCreditCode: "",
    address: "",
    companyIntro: "",
    remarks: "",
    businessEmail: "",
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      toast({
        title: "错误",
        description: "请填写所有必填项（带*号的字段）",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "错误",
        description: "两次输入的密码不一致",
        variant: "destructive",
      });
      return;
    }

    const mockTenantId = Math.floor(10000 + Math.random() * 90000).toString();
    setTenantId(mockTenantId);
    setShowSuccessDialog(true);
  };

  const copyTenantId = () => {
    navigator.clipboard.writeText(tenantId);
    toast({
      title: "复制成功",
      description: "租户号已复制到剪贴板",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 bg-white p-8 rounded-lg shadow-md">
      <RegisterHeader />
      
      <RegisterFormFields formData={formData} setFormData={setFormData} />

      <Button type="submit" className="w-full rounded-elliptical">
        注册
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <a href="/" className="text-primary hover:text-primary-hover">
          使用已有账户登陆
        </a>
      </div>

      <SuccessDialog
        showSuccessDialog={showSuccessDialog}
        setShowSuccessDialog={setShowSuccessDialog}
        tenantId={tenantId}
        onCopyTenantId={copyTenantId}
      />
    </form>
  );
};

export default RegisterForm;