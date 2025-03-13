
import React, { useState, useEffect } from 'react';
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
import PermissionsSelect from './PermissionsSelect';

// 角色表单验证模式
const roleFormSchema = z.object({
  name: z.string().min(2, { message: "角色名称至少需要2个字符" }),
  description: z.string().optional(),
  tenant_id: z.string()
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface Permission {
  id: string;
  name: string;
}

interface RoleFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: any;
  permissions: Permission[];
  fetchRolePermissions: (roleId: string) => Promise<string[]>;
  onSubmit: (values: RoleFormValues, permissions: string[]) => Promise<void>;
  isLoading: boolean;
}

// 角色表单对话框组件
const RoleFormDialog = ({ 
  isOpen, 
  setIsOpen, 
  currentRole, 
  permissions, 
  fetchRolePermissions,
  onSubmit, 
  isLoading 
}: RoleFormDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // 表单初始化
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tenant_id: "default" // 在实际应用中应该从系统或登录用户获取
    }
  });

  // 当编辑角色时，获取角色信息和权限
  useEffect(() => {
    const loadRoleData = async () => {
      if (currentRole) {
        // 重置表单值
        form.reset({
          name: currentRole.name,
          description: currentRole.description || "",
          tenant_id: currentRole.tenant_id
        });
        
        // 获取角色的权限
        const rolePermissions = await fetchRolePermissions(currentRole.id);
        setSelectedPermissions(rolePermissions);
      } else {
        // 创建新角色时重置
        form.reset({
          name: "",
          description: "",
          tenant_id: "default"
        });
        setSelectedPermissions([]);
      }
    };
    
    if (isOpen) {
      loadRoleData();
    }
  }, [currentRole, isOpen, form, fetchRolePermissions]);

  // 处理表单提交
  const handleSubmit = async (values: RoleFormValues) => {
    await onSubmit(values, selectedPermissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{currentRole ? "编辑角色" : "创建角色"}</DialogTitle>
          <DialogDescription>
            {currentRole 
              ? "修改角色信息，完成后点击保存。" 
              : "填写角色信息，完成后点击创建。"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入角色名称" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色描述</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入角色描述" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <PermissionsSelect
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "处理中..." : currentRole ? "保存" : "创建"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormDialog;
