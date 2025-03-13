
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';

// 处理用户更新的钩子
export const useUserUpdate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 更新用户
  const updateUser = async (values: UserFormValues, currentUser: any) => {
    setIsLoading(true);
    try {
      console.log("更新用户数据:", values, "用户ID:", currentUser.id);
      
      // 更新用户基本信息
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
      
      // 处理部门关联 - 如果选择了部门，则创建或更新用户-部门关联
      if (values.department_id) {
        // 首先检查是否有现有的 user_departments 表，如果没有则创建
        const { error: createTableError } = await supabase.rpc('create_user_departments_if_not_exists');
        
        // 即使表创建失败（可能是因为已经存在），也继续尝试更新部门关联
        // 尝试更新用户的部门关联
        const { error: userDeptError } = await supabase.rpc('upsert_user_department', {
          p_user_id: currentUser.id,
          p_department_id: values.department_id
        });
        
        if (userDeptError) {
          console.error('更新部门关联失败:', userDeptError);
          // 不中断流程，继续处理角色
        }
      }
      
      // 处理角色关联 - 如果选择了角色
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
      
      // 刷新用户列表
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('更新用户失败:', error);
      toast({
        title: "更新用户失败",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading, 
    updateUser
  };
};
