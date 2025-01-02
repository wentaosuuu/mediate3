import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RegistrationFields } from "./registration/RegistrationFields";
import { SuccessDialog } from "./registration/SuccessDialog";
import { RegistrationFormData } from "@/types/registration";
import { supabase } from "@/integrations/supabase/client";

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

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const { toast } = useToast();

  const handleFieldChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
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

    const missingFields = requiredFields.filter(field => !formData[field as keyof RegistrationFormData]);
    
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

    try {
      // 生成租户ID
      const generatedTenantId = Math.floor(10000 + Math.random() * 90000).toString();
      
      // 准备要保存的数据
      const registrationData = {
        tenant_id: generatedTenantId,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        company_name: formData.companyName,
        username: formData.username,
        social_credit_code: formData.socialCreditCode,
        address: formData.address || null,
        company_intro: formData.companyIntro || null,
        remarks: formData.remarks || null,
        business_email: formData.businessEmail || null,
      };

      // 保存到 Supabase
      const { error } = await supabase
        .from('tenant_registrations')
        .insert([registrationData]);

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "注册失败",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // 保存成功，显示成功对话框
      setTenantId(generatedTenantId);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "注册失败",
        description: "注册过程中发生错误，请稍后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
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