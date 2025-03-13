
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
      
      // 注意: 不要生成自己的UUID - 让Supabase自动生成
      // 修改: 不再自己指定ID，让数据库自动生成
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          username: values.username,
          email: values.email,
          phone: values.phone,
          tenant_id: values.tenant_id,
        })
        .select();

      if (userError) {
        console.error('创建用户基本信息失败:', userError);
        throw userError;
      }
      
      console.log("用户创建成功，返回数据:", userData);
      
      // 确保我们有创建的用户ID
      if (!userData || userData.length === 0) {
        throw new Error("用户创建成功但未返回用户ID");
      }
      
      const userId = userData[0].id;
      
      // 处理部门关联
      if (values.department_id) {
        try {
          console.log("开始创建用户部门关联，用户ID:", userId, "部门ID:", values.department_id);
          
          // 创建用户部门关联
          const { error: deptError } = await supabase
            .from('user_departments')
            .insert({
              user_id: userId,
              department_id: values.department_id
            });
          
          if (deptError) {
            console.error('创建部门关联失败:', deptError);
            // 记录错误但不中断流程
          } else {
            console.log("用户部门关联创建成功");
          }
        } catch (deptError) {
          console.error('处理部门关联时出错:', deptError);
          // 记录错误但不中断流程
        }
      }
      
      // 处理角色关联
      if (values.role_id) {
        try {
          console.log("开始创建用户角色关联，用户ID:", userId, "角色ID:", values.role_id);
          
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role_id: values.role_id
            });
            
          if (roleError) {
            console.error('分配角色失败:', roleError);
            // 记录错误但不中断流程
          } else {
            console.log("用户角色关联创建成功");
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
