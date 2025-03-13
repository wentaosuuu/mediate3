
import React from 'react';
import { useForm, FormProvider } from "react-hook-form";
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
  onSubmit: (values: UserFormValues) => Promise<void>;
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
  
  // 表单初始化
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      department_id: currentUser?.department_id || "",
      role_id: currentUser?.role_id || "",
      password: "",
      tenant_id: currentUser?.tenant_id || "default" // 在实际应用中应该从系统或登录用户获取
    }
  });

  // 当currentUser改变时重置表单
  React.useEffect(() => {
    if (isOpen) {
      console.log("重置表单数据:", currentUser);
      form.reset({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        department_id: currentUser?.department_id || "",
        role_id: currentUser?.role_id || "",
        password: "",
        tenant_id: currentUser?.tenant_id || "default"
      });
    }
  }, [currentUser, isOpen, form]);

  // 处理表单提交
  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("提交表单数据:", values);
    await onSubmit(values);
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
        
        <FormProvider {...form}>
          <Form>
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
