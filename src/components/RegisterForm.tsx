import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RegistrationFields } from "./registration/RegistrationFields";
import { SuccessDialog } from "./registration/SuccessDialog";
import { RegistrationFormData } from "@/types/registration";
import { supabase } from "@/integrations/supabase/client";

/**
 * 注册表单组件
 * 处理用户注册流程，包括表单数据收集、验证和提交
 */
const RegisterForm = () => {
  // 表单数据状态
  const [formData, setFormData] = useState<RegistrationFormData>({
    contactPerson: "",     // 联系人
    phone: "",            // 电话
    companyName: "",      // 公司名称
    inviteCode: "",       // 邀请码
    username: "",         // 用户名
    password: "",         // 密码
    confirmPassword: "",   // 确认密码
    socialCreditCode: "", // 统一社会信用代码
    address: "",          // 地址
    companyIntro: "",     // 公司简介
    remarks: "",          // 备注
    businessEmail: "",    // 企业邮箱
  });

  // 控制成功对话框显示状态
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  // 存储生成的租户ID
  const [tenantId, setTenantId] = useState("");
  // 提示消息hook
  const { toast } = useToast();

  /**
   * 处理表单字段变化
   * @param field 字段名
   * @param value 字段值
   */
  const handleFieldChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 处理表单提交
   * @param e 表单提交事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 必填字段列表
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

    // 检查必填字段是否都已填写
    const missingFields = requiredFields.filter(field => !formData[field as keyof RegistrationFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "错误",
        description: "请填写所有必填项（带*号的字段）",
        variant: "destructive",
      });
      return;
    }

    // 验证两次输入的密码是否一致
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "错误",
        description: "两次输入的密码不一致",
        variant: "destructive",
      });
      return;
    }

    try {
      // 生成5位数的租户ID
      const generatedTenantId = Math.floor(10000 + Math.random() * 90000).toString();
      
      // 准备要保存到数据库的数据
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

      // 向Supabase数据库插入数据
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

      // 注册成功，显示成功对话框
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
      
      {/* 注册表单字段组件 */}
      <RegistrationFields 
        formData={formData}
        onChange={handleFieldChange}
      />

      {/* 提交按钮 */}
      <Button type="submit" className="w-full">
        注册
      </Button>

      {/* 登录链接 */}
      <div className="text-center text-sm text-muted-foreground">
        <a href="/" className="text-primary hover:text-primary-hover">
          使用已有账户登陆
        </a>
      </div>

      {/* 注册成功对话框 */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        tenantId={tenantId}
      />
    </form>
  );
};

export default RegisterForm;