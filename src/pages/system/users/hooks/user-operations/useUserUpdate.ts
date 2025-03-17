
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';

// 处理用户更新的钩子
export const useUserUpdate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 更新用户
  const updateUser = async (values: UserFormValues, currentUser: any): Promise<boolean> => {
    console.log("开始更新用户，数据:", values, "用户ID:", currentUser.id);
    setIsLoading(true);
    
    try {
      // 更新用户基本信息
      const { error } = await supabase
        .from('users')
        .update({
          username: values.username,
          name: values.name,
          email: values.email,
          phone: values.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) {
        console.error('更新用户基本信息失败:', error);
        throw error;
      } else {
        console.log('用户基本信息更新成功');
      }
      
      // 处理部门关联
      if (values.department_id) {
        try {
          console.log("准备更新用户的部门关联, 部门ID:", values.department_id);
          
          // 检查是否已有部门关联
          const { data: existingDept, error: deptCheckError } = await supabase
            .from('user_departments')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
            
          if (deptCheckError && deptCheckError.code !== 'PGRST116') {
            console.error('检查用户部门关联时出错:', deptCheckError);
            throw deptCheckError;
          }
          
          if (!existingDept) {
            // 没有部门关联，创建新的
            console.log("用户没有部门关联，创建新关联");
            const { error: deptInsertError } = await supabase
              .from('user_departments')
              .insert({
                user_id: currentUser.id,
                department_id: values.department_id
              });
              
            if (deptInsertError) {
              console.error('创建部门关联失败:', deptInsertError);
              throw deptInsertError;
            } else {
              console.log('用户部门关联新建成功:', values.department_id);
            }
          } else {
            // 已有部门关联，更新它
            console.log("用户已有部门关联，更新为:", values.department_id);
            const { error: deptUpdateError } = await supabase
              .from('user_departments')
              .update({ department_id: values.department_id })
              .eq('user_id', currentUser.id);
              
            if (deptUpdateError) {
              console.error('更新部门关联失败:', deptUpdateError);
              throw deptUpdateError;
            } else {
              console.log('用户部门关联更新成功:', values.department_id);
            }
          }
        } catch (deptError) {
          console.error('处理部门关联时出错:', deptError);
          throw deptError;
        }
      } else {
        // 如果没有选择部门，但之前有部门，则删除部门关联
        console.log("用户未选择部门，检查是否需要删除现有部门关联");
        const { error: deptDeleteError } = await supabase
          .from('user_departments')
          .delete()
          .eq('user_id', currentUser.id);
          
        if (deptDeleteError && deptDeleteError.code !== 'PGRST116') {
          console.error('删除部门关联失败:', deptDeleteError);
          // 不抛出异常，允许继续处理
        } else {
          console.log('用户部门关联已删除或不存在');
        }
      }
      
      // 处理角色关联
      if (values.role_id) {
        try {
          console.log("准备更新用户的角色关联, 角色ID:", values.role_id);
          
          // 检查是否已有角色关联
          const { data: existingRole, error: roleCheckError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
            
          if (roleCheckError && roleCheckError.code !== 'PGRST116') {
            console.error('检查用户角色关联时出错:', roleCheckError);
            throw roleCheckError;
          }
          
          if (!existingRole) {
            // 没有角色关联，创建新的
            console.log("用户没有角色关联，创建新关联");
            const { error: roleInsertError } = await supabase
              .from('user_roles')
              .insert({
                user_id: currentUser.id,
                role_id: values.role_id
              });
              
            if (roleInsertError) {
              console.error('分配角色失败:', roleInsertError);
              throw roleInsertError;
            } else {
              console.log('用户角色新建成功:', values.role_id);
            }
          } else {
            // 已有角色关联，更新它
            console.log("用户已有角色关联，更新为:", values.role_id);
            const { error: roleUpdateError } = await supabase
              .from('user_roles')
              .update({ role_id: values.role_id })
              .eq('user_id', currentUser.id);
              
            if (roleUpdateError) {
              console.error('更新角色失败:', roleUpdateError);
              throw roleUpdateError;
            } else {
              console.log('用户角色更新成功:', values.role_id);
            }
          }
        } catch (roleError) {
          console.error('处理角色关联时出错:', roleError);
          throw roleError;
        }
      } else {
        // 如果没有选择角色，但之前有角色，则删除角色关联
        console.log("用户未选择角色，检查是否需要删除现有角色关联");
        const { error: roleDeleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', currentUser.id);
          
        if (roleDeleteError && roleDeleteError.code !== 'PGRST116') {
          console.error('删除角色关联失败:', roleDeleteError);
          // 不抛出异常，允许继续处理
        } else {
          console.log('用户角色关联已删除或不存在');
        }
      }
      
      // 显示成功提示
      toast({
        title: "用户更新成功",
        description: `用户 ${values.name} 已更新`,
      });
      
      // 刷新用户列表
      await fetchUsers();
      console.log("更新用户流程完成，返回成功状态");
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
