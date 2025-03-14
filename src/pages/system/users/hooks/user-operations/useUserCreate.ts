
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';

// 用户创建钩子
export const useUserCreate = (refreshUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 创建新用户
  const createUser = async (values: UserFormValues): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 确保移除可能存在的__isEditMode字段
      const { __isEditMode, ...userData } = values;
      console.log("开始创建用户，用户数据:", userData);
      
      // 1. 创建用户基本信息 - 使用.insert()而不是受限制的.upsert()
      // 生成一个UUID用于新用户的ID
      const newUserId = crypto.randomUUID();
      
      const { data: userResult, error: userError } = await supabase
        .from('users')
        .insert({
          id: newUserId, // 显式提供ID
          username: userData.username,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          tenant_id: userData.tenant_id
        })
        .select('id, username, name, email')
        .single();
      
      if (userError) {
        console.error("创建用户基本信息失败:", userError);
        throw new Error(`创建用户失败: ${userError.message}`);
      }
      
      if (!userResult) {
        throw new Error("创建用户后未返回用户数据");
      }
      
      const userId = userResult.id;
      console.log("用户基本信息创建成功，用户ID:", userId);
      
      // 2. 如果提供了部门ID，创建用户-部门关联
      if (userData.department_id) {
        console.log("为用户设置部门:", userData.department_id);
        const { error: deptError } = await supabase.rpc(
          'upsert_user_department',
          { 
            p_user_id: userId, 
            p_department_id: userData.department_id 
          }
        );
        
        if (deptError) {
          console.error("创建用户-部门关联失败:", deptError);
          // 不中断流程，但记录错误
          toast({
            title: "设置用户部门失败",
            description: deptError.message,
            variant: "destructive",
          });
        }
      }
      
      // 3. 如果提供了角色ID，创建用户-角色关联
      if (userData.role_id) {
        console.log("为用户设置角色:", userData.role_id);
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: userData.role_id
          });
        
        if (roleError) {
          console.error("创建用户-角色关联失败:", roleError);
          // 不中断流程，但记录错误
          toast({
            title: "设置用户角色失败",
            description: roleError.message,
            variant: "destructive",
          });
        }
      }
      
      console.log("用户创建成功，用户ID:", userId);
      
      // 刷新用户列表
      await refreshUsers();
      
      toast({
        title: "用户创建成功",
        description: `已成功创建用户: ${userData.username}`,
      });
      
      return true;
    } catch (error) {
      console.error("创建用户过程中出错:", error);
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
