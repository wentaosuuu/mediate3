import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";

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

    // 模拟注册成功
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
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">法调云2.0</h1>
      </div>
      
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="联系人*"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="tel"
            placeholder="联系电话*"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="企业名称*"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="邀请码*"
            value={formData.inviteCode}
            onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="用户名*"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="密码*"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="确认密码*"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="统一社会信用代码*"
            value={formData.socialCreditCode}
            onChange={(e) => setFormData({ ...formData, socialCreditCode: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="地址"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="公司简介"
            value={formData.companyIntro}
            onChange={(e) => setFormData({ ...formData, companyIntro: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="备注"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="email"
            placeholder="企业邮箱"
            value={formData.businessEmail}
            onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        注册
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <a href="/" className="text-primary hover:text-primary-hover">
          使用已有账户登陆
        </a>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注册成功</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">您的租户号是：</p>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="font-mono">{tenantId}</span>
              <Button variant="outline" size="icon" onClick={copyTenantId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              请保存好您的租户号，登录时需要使用
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => window.location.href = "/"}>
              返回登录
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default RegisterForm;