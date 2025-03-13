
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 用户表单验证模式
const userFormSchema = z.object({
  username: z.string().min(2, { message: "用户名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone: z.string().optional(),
  department_id: z.string().optional(),
  role_id: z.string().optional(),
  password: z.string().min(6, { message: "密码至少需要6个字符" }).optional(),
  tenant_id: z.string()
});

type UserFormValues = z.infer<typeof userFormSchema>;

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
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入用户名" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="请输入邮箱" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>电话</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入电话" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!currentUser && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        placeholder="请输入密码" 
                        disabled={isLoading} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>部门</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择部门" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">请选择部门</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择角色" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">请选择角色</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "处理中..." : currentUser ? "保存" : "创建"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
