
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
        try {
          // 首先检查用户部门表是否存在，如果不存在则创建
          const { error: createTableError } = await supabase.rpc(
            'create_user_departments_if_not_exists', 
            {} as Record<string, never>
          );
          
          if (createTableError) {
            console.error('创建用户部门表失败:', createTableError);
            // 继续尝试其他操作
          } else {
            // 如果表创建成功或已存在，则更新用户的部门关联
            const { error: userDeptError } = await supabase.rpc(
              'upsert_user_department', 
              { 
                p_user_id: currentUser.id, 
                p_department_id: values.department_id 
              } as { 
                p_user_id: string, 
                p_department_id: string 
              }
            );
            
            if (userDeptError) {
              console.error('更新部门关联失败:', userDeptError);
              // 记录错误但不中断流程
            }
          }
        } catch (deptError) {
          console.error('处理部门关联时出错:', deptError);
          // 记录错误但不中断流程
        }
      }
      
      // 处理角色关联 - 如果选择了角色
      if (values.role_id) {
        try {
          // 首先检查是否已有角色关联
          const { data: existingRoles, error: fetchError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', currentUser.id);
            
          if (fetchError) {
            console.error('获取角色关联失败:', fetchError);
            // 但继续处理
          }
          
          if (existingRoles && existingRoles.length > 0) {
            // 已有角色关联，更新它
            const { error: roleUpdateError } = await supabase
              .from('user_roles')
              .update({ role_id: values.role_id })
              .eq('user_id', currentUser.id);
              
            if (roleUpdateError) {
              console.error('更新角色失败:', roleUpdateError);
              // 记录错误但不中断流程
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
              // 记录错误但不中断流程
            }
          }
        } catch (roleError) {
          console.error('处理角色关联时出错:', roleError);
          // 记录错误但不中断流程
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
