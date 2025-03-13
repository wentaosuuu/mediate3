
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RolesSearch from './components/RolesSearch';
import RolesTable from './components/RolesTable';
import RoleFormDialog from './components/RoleFormDialog';

// 角色管理组件
const RolesManagement = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const { toast } = useToast();

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
          toast({
            title: "角色表不存在",
            description: "需要先创建角色表并配置相关权限",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        // 使用模拟数据
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
      } else {
        setRoles(data || []);
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
      toast({
        title: "获取角色列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
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

  // 打开创建角色对话框
  const openCreateDialog = () => {
    setCurrentRole(null);
    setIsDialogOpen(true);
  };

  // 打开编辑角色对话框
  const openEditDialog = async (role: any) => {
    setCurrentRole(role);
    setIsDialogOpen(true);
  };

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
          toast({
            title: "角色表不存在",
            description: "需要先创建角色表",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "角色删除成功",
        });
        fetchRoles();
      }
    } catch (error) {
      console.error('删除角色失败:', error);
      toast({
        title: "删除角色失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 处理角色创建或更新
  const handleRoleSubmit = async (values: any, rolePermissions: string[]) => {
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
        
        toast({
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
        
        toast({
          title: "角色创建成功",
          description: `角色 ${values.name} 已创建`,
        });
      }
      
      // 刷新角色列表
      fetchRoles();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('角色操作失败:', error);
      toast({
        title: "角色操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤角色列表
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          创建角色
        </Button>
      </div>

      <RolesSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <RolesTable 
        roles={filteredRoles} 
        isLoading={isLoading} 
        onEdit={openEditDialog} 
        onDelete={deleteRole} 
      />

      <RoleFormDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        currentRole={currentRole} 
        permissions={permissions}
        fetchRolePermissions={fetchRolePermissions}
        onSubmit={handleRoleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RolesManagement;
