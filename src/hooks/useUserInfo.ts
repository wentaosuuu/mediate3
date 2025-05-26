
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * 用户信息钩子 - 提供用户认证状态和用户信息
 */
export const useUserInfo = () => {
  const user = useUser();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        if (user) {
          console.log('开始获取用户信息，用户ID:', user.id);
          
          // 获取用户基本信息
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (userError) {
            console.error('获取用户基本信息失败:', userError);
          } else if (userData) {
            console.log('获取到用户基本信息:', userData);
            
            // 优先使用 name 字段，其次是 username，最后是邮箱前缀
            const displayName = userData.name || userData.username || user.email?.split('@')[0] || '用户';
            setUsername(displayName);
            setTenantId(userData.tenant_id || null);
            console.log('设置用户名为:', displayName);
          } else {
            console.log('未找到用户基本信息，使用邮箱前缀');
            const displayName = user.email?.split('@')[0] || '用户';
            setUsername(displayName);
          }
          
          // 获取用户角色信息
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select(`
              role_id,
              roles(id, name)
            `)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (roleError) {
            console.error('获取用户角色失败:', roleError);
            setRole('普通用户');
          } else if (roleData && roleData.roles) {
            console.log('找到用户角色:', roleData.roles.name);
            setRole(roleData.roles.name);
          } else {
            console.log('未找到用户角色信息，设置为默认值');
            setRole('普通用户');
          }
          
          // 获取用户部门信息
          const { data: deptData, error: deptError } = await supabase
            .from('user_departments')
            .select(`
              department_id,
              departments(id, name)
            `)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (deptError) {
            console.error('获取用户部门失败:', deptError);
            setDepartment('未分配');
          } else if (deptData && deptData.departments) {
            console.log('找到用户部门:', deptData.departments.name);
            setDepartment(deptData.departments.name);
          } else {
            console.log('未找到用户部门信息，设置为默认值');
            setDepartment('未分配');
          }

          console.log('用户信息加载完成');
        } else {
          // 用户未登录，重置所有状态
          console.log('用户未登录，重置状态');
          setUsername(null);
          setRole(null);
          setDepartment(null);
          setTenantId(null);
        }
      } catch (error) {
        console.error('获取用户信息异常:', error);
        // 设置默认值以防出错
        if (user) {
          setUsername(user.email?.split('@')[0] || '用户');
          setRole('普通用户');
          setDepartment('未分配');
        }
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [user?.id]); // 依赖 user.id 而不是整个 user 对象

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error('登出失败:', error);
      return false;
    }
  };

  // 构造用户信息对象 - 修复这里的逻辑
  const userInfo = {
    isLoggedIn: !!user,
    userId: user?.id || '',
    email: user?.email || '',
    username: username || '未登录用户', // 直接使用 username 状态
    role: role || '普通用户', // 直接使用 role 状态
    department: department || '未分配', // 直接使用 department 状态
    tenantId: tenantId || '',
  };

  console.log('当前返回的用户信息:', userInfo);

  return {
    userInfo,
    handleLogout,
    isInitialized,
    isLoading
  };
};
