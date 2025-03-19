
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 角色表单验证模式
export const roleFormSchema = z.object({
  name: z.string().min(2, { message: "角色名称至少需要2个字符" }),
  description: z.string().optional(),
  tenant_id: z.string()
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

/**
 * 角色表单钩子
 * 处理角色表单的状态和验证
 */
export const useRoleForm = (
  currentRole: any | null, 
  isOpen: boolean,
  fetchRolePermissions: (roleId: string) => Promise<string[]>
) => {
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

  return {
    form,
    selectedPermissions,
    setSelectedPermissions
  };
};
