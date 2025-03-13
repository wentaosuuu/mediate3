
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';

// 处理用户创建的钩子
export const useUserCreate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 创建用户
  const createUser = async (values: UserFormValues) => {
    setIsLoading(true);
    let createdSuccessfully = false;
    
    try {
      console.log("创建用户，数据:", values);
      
      // 生成一个随机ID
      const userId = crypto.randomUUID();
      
      // 创建用户
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          username: values.username,
          email: values.email,
          phone: values.phone,
          tenant_id: values.tenant_id,
        });

      if (error) {
        console.error('创建用户基本信息失败:', error);
        throw error;
      }
      
      // 处理部门关联
      if (values.department_id) {
        try {
          // 确保user_departments表存在
          await supabase.rpc('create_user_departments_if_not_exists');
          
          // 创建用户部门关联
          const { error: deptError } = await supabase.rpc(
            'upsert_user_department', 
            { 
              p_user_id: userId, 
              p_department_id: values.department_id 
            }
          );
          
          if (deptError) {
            console.error('创建部门关联失败:', deptError);
            // 记录错误但不中断流程
          }
        } catch (deptError) {
          console.error('处理部门关联时出错:', deptError);
          // 记录错误但不中断流程
        }
      }
      
      // 处理角色关联
      if (values.role_id) {
        try {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role_id: values.role_id
            });
            
          if (roleError) {
            console.error('分配角色失败:', roleError);
            // 记录错误但不中断流程
          }
        } catch (roleError) {
          console.error('处理角色关联时出错:', roleError);
          // 记录错误但不中断流程
        }
      }

      toast({
        title: "用户创建成功",
        description: `用户 ${values.username} 已创建`,
      });
      
      createdSuccessfully = true;
      
      // 刷新用户列表
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('创建用户失败:', error);
      toast({
        title: "创建用户失败",
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
    createUser
  };
};
