import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RegistrationFields } from "./registration/RegistrationFields";
import { SuccessDialog } from "./registration/SuccessDialog";
import { RegistrationFormData } from "@/types/registration";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
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

  const { showSuccessDialog, setShowSuccessDialog, tenantId, handleSubmit } = useRegistrationSubmit();

  const handleFieldChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData, setFormData);
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">法调云2.0</h1>
      </div>
      
      <RegistrationFields 
        formData={formData}
        onChange={handleFieldChange}
      />

      <Button type="submit" className="w-full">
        注册
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <a href="/" className="text-primary hover:text-primary-hover">
          使用已有账户登陆
        </a>
      </div>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        tenantId={tenantId}
      />
    </form>
  );
};

export default RegisterForm;