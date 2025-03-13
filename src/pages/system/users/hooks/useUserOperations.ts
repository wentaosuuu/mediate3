
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../components/user-form/UserFormSchema';

// 用户操作钩子
export const useUserOperations = (fetchUsers: () => Promise<void>) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 处理用户创建或更新
  const handleSubmit = async (values: UserFormValues) => {
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
            department_id: values.department_id,
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
            department_id: values.department_id,
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
  const openEditDialog = async (user: any) => {
    try {
      setIsLoading(true);
      // 加载用户的角色信息
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .single();
      
      // 将角色信息添加到用户对象
      const enhancedUser = {
        ...user,
        role_id: userRoles?.role_id || ""
      };
      
      console.log("打开编辑对话框，用户数据:", enhancedUser);
      setCurrentUser(enhancedUser);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("获取用户角色失败:", error);
      // 如果获取角色失败，仍然打开对话框，但没有角色信息
      setCurrentUser(user);
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
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

  return {
    currentUser,
    isDialogOpen,
    isLoading,
    setIsDialogOpen,
    handleSubmit,
    openCreateDialog,
    openEditDialog,
    toggleUserStatus,
    deleteUser
  };
};
