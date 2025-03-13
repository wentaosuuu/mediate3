
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { userFormSchema, UserFormValues } from './user-form/UserFormSchema';
import UserBasicInfo from './user-form/UserBasicInfo';
import UserAssociation from './user-form/UserAssociation';
import UserFormActions from './user-form/UserFormActions';
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  currentUser: any | null;
  isLoading: boolean;
  departments: Department[];
  roles: Role[];
}

const UserFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentUser,
  isLoading,
  departments,
  roles
}: UserFormDialogProps) => {
  const { toast } = useToast();
  
  // 表单初始化
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      department_id: "",
      role_id: "",
      password: "",
      tenant_id: "default" // 在实际应用中应该从系统或登录用户获取
    }
  });

  // 当currentUser改变时重置表单
  React.useEffect(() => {
    if (isOpen) {
      console.log("重置表单数据:", currentUser);
      if (currentUser) {
        // 编辑用户模式
        form.reset({
          username: currentUser?.username || "",
          email: currentUser?.email || "",
          phone: currentUser?.phone || "",
          department_id: currentUser?.department_id || "",
          role_id: currentUser?.role_id || "",
          password: "",  // 编辑模式不需要密码
          tenant_id: currentUser?.tenant_id || "default"
        });
      } else {
        // 创建用户模式
        form.reset({
          username: "",
          email: "",
          phone: "",
          department_id: "",
          role_id: "",
          password: "",
          tenant_id: "default"
        });
      }
    }
  }, [currentUser, isOpen, form]);

  // 处理表单提交
  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("提交表单数据:", values);
    try {
      const success = await onSubmit(values);
      if (success) {
        console.log("表单提交成功，关闭对话框");
        // 成功后手动关闭对话框
        onOpenChange(false);
      } else {
        console.error("表单提交返回失败");
      }
    } catch (error) {
      console.error("表单提交失败:", error);
      toast({
        title: "操作失败",
        description: `${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{currentUser ? "编辑用户" : "创建用户"}</DialogTitle>
          <DialogDescription>
            {currentUser 
              ? "修改用户信息，完成后点击保存。" 
              : "填写用户信息，完成后点击创建。"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 基本信息组件 */}
            <UserBasicInfo isLoading={isLoading} currentUser={currentUser} />
            
            {/* 部门和角色关联组件 */}
            <UserAssociation 
              isLoading={isLoading} 
              departments={departments} 
              roles={roles} 
            />
            
            {/* 表单操作按钮组件 */}
            <UserFormActions 
              isLoading={isLoading} 
              currentUser={currentUser} 
              onCancel={() => onOpenChange(false)} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
