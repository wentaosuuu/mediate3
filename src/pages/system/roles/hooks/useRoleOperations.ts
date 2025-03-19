
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

/**
 * 角色操作钩子
 * 负责处理角色的创建、更新、删除和权限分配
 */
export const useRoleOperations = (fetchRoles: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast: uiToast } = useToast();

  // 删除角色
  const deleteRole = async (roleId: string) => {
    if (!confirm("确定要删除此角色吗？此操作不可撤销。")) return;
    
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        if (error.code === "42P01") {
          uiToast({
            title: "角色表不存在",
            description: "需要先创建角色表",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        uiToast({
          title: "角色删除成功",
        });
        fetchRoles();
      }
    } catch (error) {
      console.error('删除角色失败:', error);
      uiToast({
        title: "删除角色失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 处理角色创建或更新
  const handleRoleSubmit = async (values: any, rolePermissions: string[], currentRole: any | null): Promise<void> => {
    setIsLoading(true);
    try {
      if (currentRole) {
        // 更新角色
        const { error } = await supabase
          .from('roles')
          .update({
            name: values.name,
            description: values.description,
          })
          .eq('id', currentRole.id);

        if (error) throw error;
        
        // 处理权限关联
        if (rolePermissions.length > 0) {
          // 先删除旧的权限关联
          await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', currentRole.id);
            
          // 添加新的权限关联
          const newPermissions = rolePermissions.map(permissionId => ({
            role_id: currentRole.id,
            permission_id: permissionId
          }));
          
          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(newPermissions);
            
          if (permError) {
            console.error('更新角色权限失败:', permError);
          }
        }
        
        uiToast({
          title: "角色更新成功",
          description: `角色 ${values.name} 已更新`,
        });
      } else {
        // 创建角色
        const { data, error } = await supabase
          .from('roles')
          .insert({
            name: values.name,
            description: values.description,
            tenant_id: values.tenant_id,
          })
          .select();

        if (error) throw error;
        
        // 处理权限关联
        if (rolePermissions.length > 0 && data && data.length > 0) {
          const roleId = data[0].id;
          const newPermissions = rolePermissions.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId
          }));
          
          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(newPermissions);
            
          if (permError) {
            console.error('设置角色权限失败:', permError);
          }
        }
        
        uiToast({
          title: "角色创建成功",
          description: `角色 ${values.name} 已创建`,
        });
      }
      
      // 刷新角色列表
      fetchRoles();
      // 移除返回值 true
    } catch (error) {
      console.error('角色操作失败:', error);
      uiToast({
        title: "角色操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
      // 移除返回值 false
    } finally {
      setIsLoading(false);
    }
  };

  // 保存数据权限
  const handleSaveDataPermission = async (
    roleId: string, 
    permissionCode: string, 
    permissionType: string
  ) => {
    try {
      // 将数据权限保存到角色表中
      const { error } = await supabase
        .from('roles')
        .update({
          permission_code: permissionCode,
          data_permission_type: permissionType,
          updated_at: new Date().toISOString()
        })
        .eq('id', roleId);
        
      if (error) throw error;
      
      // 使用sonner的toast显示成功信息
      sonnerToast.success('数据权限设置成功');
      
      // 刷新角色列表
      fetchRoles();
    } catch (error) {
      console.error('保存数据权限失败:', error);
      // 使用sonner的toast显示错误信息
      sonnerToast.error('保存数据权限失败: ' + (error as Error).message);
      throw error;
    }
  };

  return {
    isLoading,
    deleteRole,
    handleRoleSubmit,
    handleSaveDataPermission
  };
};
