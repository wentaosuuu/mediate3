
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
    try {
      // 生成一个随机ID
      const userId = crypto.randomUUID();
      
      // 创建用户时不包含 department_id 字段
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
      
      // 刷新用户列表
      fetchUsers();
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
