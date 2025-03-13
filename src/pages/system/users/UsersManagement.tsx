
import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserSearch from './components/UserSearch';
import UsersTable from './components/UsersTable';
import UserFormDialog from './components/UserFormDialog';

const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // 获取用户列表
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          username, 
          email, 
          phone, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      toast({
        title: "获取用户列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('获取部门列表失败:', error);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      // 如果角色表还未创建，使用模拟数据
      setRoles([
        { id: '1', name: '管理员' },
        { id: '2', name: '普通用户' }
      ]);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  // 处理用户创建或更新
  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (currentUser) {
        // 更新用户
        console.log("更新用户数据:", values, "用户ID:", currentUser.id);
        
        const { error } = await supabase
          .from('users')
          .update({
            username: values.username,
            email: values.email,
            phone: values.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.id);

        if (error) throw error;
        
        // 如果选择了角色，则更新用户-角色关联
        if (values.role_id) {
          // 首先检查是否已有角色关联
          const { data: existingRoles } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', currentUser.id);
            
          if (existingRoles && existingRoles.length > 0) {
            // 已有角色关联，更新它
            const { error: roleUpdateError } = await supabase
              .from('user_roles')
              .update({ role_id: values.role_id })
              .eq('user_id', currentUser.id);
              
            if (roleUpdateError) {
              console.error('更新角色失败:', roleUpdateError);
            }
          } else {
            // 没有角色关联，创建新的
            const { error: roleInsertError } = await supabase
              .from('user_roles')
              .insert({
                user_id: currentUser.id,
                role_id: values.role_id
              });
              
            if (roleInsertError) {
              console.error('分配角色失败:', roleInsertError);
            }
          }
        }
        
        toast({
          title: "用户更新成功",
          description: `用户 ${values.username} 已更新`,
        });
      } else {
        // 创建用户
        // 在实际应用中，这里应该使用 auth.signUp 方法
        // 生成一个随机ID
        const userId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: values.username,
            email: values.email,
            phone: values.phone,
            tenant_id: values.tenant_id,
          });

        if (error) throw error;
        
        // 如果选择了角色，则添加用户-角色关联
        if (values.role_id) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role_id: values.role_id
            });
            
          if (roleError) {
            console.error('分配角色失败:', roleError);
          }
        }

        toast({
          title: "用户创建成功",
          description: `用户 ${values.username} 已创建`,
        });
      }
      
      // 刷新用户列表
      fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('用户操作失败:', error);
      toast({
        title: "用户操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 打开创建用户对话框
  const openCreateDialog = () => {
    setCurrentUser(null);
    setIsDialogOpen(true);
  };

  // 打开编辑用户对话框
  const openEditDialog = (user: any) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  // 启用/禁用用户
  const toggleUserStatus = async (user: any, status: boolean) => {
    try {
      // 实际应用中应该更新用户状态
      toast({
        title: status ? "用户已启用" : "用户已禁用",
        description: `用户 ${user.username} 状态已更新`,
      });
      fetchUsers();
    } catch (error) {
      console.error('更新用户状态失败:', error);
      toast({
        title: "操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 删除用户
  const deleteUser = async (userId: string) => {
    if (!confirm("确定要删除此用户吗？此操作不可撤销。")) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      toast({
        title: "用户删除成功",
      });
      fetchUsers();
    } catch (error) {
      console.error('删除用户失败:', error);
      toast({
        title: "删除用户失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 过滤用户列表
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button onClick={openCreateDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          创建用户
        </Button>
      </div>

      <UserSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        onEditUser={openEditDialog}
        onToggleStatus={toggleUserStatus}
        onDeleteUser={deleteUser}
      />

      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        currentUser={currentUser}
        isLoading={isLoading}
        departments={departments}
        roles={roles}
      />
    </div>
  );
};

export default UsersManagement;
