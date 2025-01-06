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

  const checkUsernameExists = async (username: string) => {
    const { data, error } = await supabase
      .from('tenant_registrations')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Username check error:', error);
      return true;
    }

    return data !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const usernameExists = await checkUsernameExists(formData.username);
    if (usernameExists) {
      toast({
        title: "错误",
        description: "该用户名已被使用，请选择其他用户名",
        variant: "destructive",
      });
      return;
    }

    try {
      const generatedTenantId = Math.floor(10000 + Math.random() * 90000).toString();
      const email = formData.businessEmail || `${formData.username}@${generatedTenantId}.com`;
      
      // 1. 创建 Supabase Auth 用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: formData.password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "注册失败",
          description: "创建用户账户时发生错误",
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        console.error('No user data returned from auth signup');
        toast({
          title: "注册失败",
          description: "创建用户账户时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 2. 创建租户注册记录
      const { error: registrationError } = await supabase
        .from('tenant_registrations')
        .insert([{
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
        }]);

      if (registrationError) {
        console.error('Registration error:', registrationError);
        // 如果租户注册失败，删除已创建的 auth 用户
        await supabase.auth.admin.deleteUser(authData.user.id);
        toast({
          title: "注册失败",
          description: "创建租户信息时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 3. 创建用户记录
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          tenant_id: generatedTenantId,
          username: formData.username,
          phone: formData.phone,
          email: email
        }]);

      if (userError) {
        console.error('User creation error:', userError);
        // 如果用户创建失败，回滚所有更改
        await supabase.auth.admin.deleteUser(authData.user.id);
        await supabase
          .from('tenant_registrations')
          .delete()
          .eq('tenant_id', generatedTenantId);

        toast({
          title: "注册失败",
          description: "创建用户记录时发生错误",
          variant: "destructive",
        });
        return;
      }

      setTenantId(generatedTenantId);
      setShowSuccessDialog(true);
      
      // 清空表单
      setFormData({
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