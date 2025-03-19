
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * 角色数据管理钩子
 * 负责获取角色列表和权限列表
 */
export const useRoleData = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast: uiToast } = useToast();

  // 获取角色列表
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('roles')
        .select(`
          id, 
          name, 
          description, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) {
        console.log("获取角色列表错误：", error);
        // 如果表不存在，显示提示信息
        if (error.code === "42P01") {
          uiToast({
            title: "角色表不存在",
            description: "需要先创建角色表并配置相关权限",
            variant: "destructive",
          });
        } else {
          uiToast({
            title: "获取角色列表失败",
            description: error.message,
            variant: "destructive",
          });
        }
        // 使用模拟数据
        const mockData = [
          { 
            id: '1', 
            name: '管理员', 
            description: '系统管理员，拥有所有权限', 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: '2', 
            name: '普通用户', 
            description: '普通用户，拥有基本操作权限', 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        console.log("使用模拟角色数据:", mockData);
        setRoles(mockData);
      } else {
        console.log("成功获取角色数据:", data);
        setRoles(data || []);
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
      uiToast({
        title: "获取角色列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
      // 确保在发生异常时也设置一些默认数据
      setRoles([
        { 
          id: '1', 
          name: '管理员', 
          description: '系统管理员，拥有所有权限', 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: '普通用户', 
          description: '普通用户，拥有基本操作权限', 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取权限列表
  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('id, name');
        
      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('获取权限列表失败:', error);
      // 使用备用数据
      setPermissions([
        { id: 'user:create', name: '创建用户' },
        { id: 'user:read', name: '查看用户' },
        { id: 'user:update', name: '更新用户' },
        { id: 'user:delete', name: '删除用户' },
        { id: 'role:create', name: '创建角色' },
        { id: 'role:read', name: '查看角色' },
        { id: 'role:update', name: '更新角色' },
        { id: 'role:delete', name: '删除角色' },
        { id: 'department:create', name: '创建部门' },
        { id: 'department:read', name: '查看部门' },
        { id: 'department:update', name: '更新部门' },
        { id: 'department:delete', name: '删除部门' }
      ]);
    }
  };

  // 获取角色的权限
  const fetchRolePermissions = async (roleId: string) => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleId);
        
      if (error) throw error;
      
      return data?.map(item => item.permission_id) || [];
    } catch (error) {
      console.error('获取角色权限失败:', error);
      return [];
    }
  };

  // 初始加载
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  return {
    roles,
    permissions,
    isLoading,
    fetchRoles,
    fetchPermissions,
    fetchRolePermissions
  };
};
