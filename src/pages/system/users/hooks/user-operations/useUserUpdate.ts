
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';

/**
 * 更新用户基本信息
 */
const updateUserBasicInfo = async (userId: string, values: UserFormValues) => {
  console.log("更新用户基本信息，用户ID:", userId);
  
  const { error } = await supabase
    .from('users')
    .update({
      username: values.username,
      name: values.name,
      email: values.email,
      phone: values.phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('更新用户基本信息失败:', error);
    throw error;
  } else {
    console.log('用户基本信息更新成功');
  }
};

/**
 * 检查用户是否已有部门关联
 */
const checkExistingDepartment = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_departments')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error && error.code !== 'PGRST116') {
    console.error('检查用户部门关联时出错:', error);
    throw error;
  }
  
  return data;
};

/**
 * 创建新的部门关联
 */
const createDepartmentAssociation = async (userId: string, departmentId: string) => {
  console.log("创建新的部门关联, 用户ID:", userId, "部门ID:", departmentId);
  
  const { error } = await supabase
    .from('user_departments')
    .insert({
      user_id: userId,
      department_id: departmentId
    });
    
  if (error) {
    console.error('创建部门关联失败:', error);
    throw error;
  } else {
    console.log('用户部门关联新建成功:', departmentId);
  }
};

/**
 * 更新现有部门关联
 */
const updateDepartmentAssociation = async (userId: string, departmentId: string) => {
  console.log("更新部门关联, 用户ID:", userId, "新部门ID:", departmentId);
  
  const { error } = await supabase
    .from('user_departments')
    .update({ department_id: departmentId })
    .eq('user_id', userId);
    
  if (error) {
    console.error('更新部门关联失败:', error);
    throw error;
  } else {
    console.log('用户部门关联更新成功:', departmentId);
  }
};

/**
 * 删除部门关联
 */
const deleteDepartmentAssociation = async (userId: string) => {
  console.log("删除部门关联, 用户ID:", userId);
  
  const { error } = await supabase
    .from('user_departments')
    .delete()
    .eq('user_id', userId);
    
  if (error && error.code !== 'PGRST116') {
    console.error('删除部门关联失败:', error);
    // 不抛出异常，允许继续处理
  } else {
    console.log('用户部门关联已删除或不存在');
  }
};

/**
 * 处理用户部门关联
 */
const handleDepartmentAssociation = async (userId: string, departmentId?: string) => {
  try {
    if (departmentId) {
      // 有部门ID，需要关联或更新部门
      const existingDept = await checkExistingDepartment(userId);
      
      if (!existingDept) {
        // 没有现有关联，创建新的
        await createDepartmentAssociation(userId, departmentId);
      } else {
        // 有现有关联，更新它
        await updateDepartmentAssociation(userId, departmentId);
      }
    } else {
      // 没有部门ID，删除现有关联（如果有的话）
      await deleteDepartmentAssociation(userId);
    }
  } catch (error) {
    console.error('处理部门关联时出错:', error);
    throw error;
  }
};

/**
 * 检查用户是否已有角色关联
 */
const checkExistingRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error && error.code !== 'PGRST116') {
    console.error('检查用户角色关联时出错:', error);
    throw error;
  }
  
  return data;
};

/**
 * 创建新的角色关联
 */
const createRoleAssociation = async (userId: string, roleId: string) => {
  console.log("创建新的角色关联, 用户ID:", userId, "角色ID:", roleId);
  
  const { error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role_id: roleId
    });
    
  if (error) {
    console.error('分配角色失败:', error);
    throw error;
  } else {
    console.log('用户角色新建成功:', roleId);
  }
};

/**
 * 更新现有角色关联
 */
const updateRoleAssociation = async (userId: string, roleId: string) => {
  console.log("更新角色关联, 用户ID:", userId, "新角色ID:", roleId);
  
  const { error } = await supabase
    .from('user_roles')
    .update({ role_id: roleId })
    .eq('user_id', userId);
    
  if (error) {
    console.error('更新角色失败:', error);
    throw error;
  } else {
    console.log('用户角色更新成功:', roleId);
  }
};

/**
 * 删除角色关联
 */
const deleteRoleAssociation = async (userId: string) => {
  console.log("删除角色关联, 用户ID:", userId);
  
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);
    
  if (error && error.code !== 'PGRST116') {
    console.error('删除角色关联失败:', error);
    // 不抛出异常，允许继续处理
  } else {
    console.log('用户角色关联已删除或不存在');
  }
};

/**
 * 处理用户角色关联
 */
const handleRoleAssociation = async (userId: string, roleId?: string) => {
  try {
    if (roleId) {
      // 有角色ID，需要关联或更新角色
      const existingRole = await checkExistingRole(userId);
      
      if (!existingRole) {
        // 没有现有关联，创建新的
        await createRoleAssociation(userId, roleId);
      } else {
        // 有现有关联，更新它
        await updateRoleAssociation(userId, roleId);
      }
    } else {
      // 没有角色ID，删除现有关联（如果有的话）
      await deleteRoleAssociation(userId);
    }
  } catch (error) {
    console.error('处理角色关联时出错:', error);
    throw error;
  }
};

/**
 * 处理用户更新的钩子
 */
export const useUserUpdate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 更新用户主函数
  const updateUser = async (values: UserFormValues, currentUser: any): Promise<boolean> => {
    console.log("开始更新用户，数据:", values, "用户ID:", currentUser.id);
    setIsLoading(true);
    
    try {
      // 1. 更新用户基本信息
      await updateUserBasicInfo(currentUser.id, values);
      
      // 2. 处理部门关联
      await handleDepartmentAssociation(currentUser.id, values.department_id);
      
      // 3. 处理角色关联
      await handleRoleAssociation(currentUser.id, values.role_id);
      
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
