
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
            setIsInitialized(true);
            setIsLoading(false);
            return;
          }
          
          if (!userData) {
            console.error('未找到用户信息');
            setIsInitialized(true);
            setIsLoading(false);
            return;
          }
          
          console.log('获取到用户基本信息:', userData);
          
          // 设置用户名和租户ID
          setUsername(userData.username || userData.name || user.email || '未知用户');
          setTenantId(userData.tenant_id || null);
          
          // 获取用户角色信息 - 使用联表查询直接获取角色名称
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select(`
              role_id,
              roles:roles(name)
            `)
            .eq('user_id', user.id)
            .limit(1);
            
          if (roleError) {
            console.error('获取用户角色失败:', roleError);
          } else if (roleData && roleData.length > 0 && roleData[0].roles) {
            console.log('找到用户角色:', roleData[0].roles.name);
            setRole(roleData[0].roles.name);
          } else {
            console.log('未找到用户角色信息，设置为默认值');
            setRole('普通用户');
          }
          
          // 获取用户部门信息 - 使用联表查询直接获取部门名称
          const { data: deptData, error: deptError } = await supabase
            .from('user_departments')
            .select(`
              department_id,
              departments:departments(name)
            `)
            .eq('user_id', user.id)
            .limit(1);
            
          if (deptError) {
            console.error('获取用户部门失败:', deptError);
          } else if (deptData && deptData.length > 0 && deptData[0].departments) {
            console.log('找到用户部门:', deptData[0].departments.name);
            setDepartment(deptData[0].departments.name);
          } else {
            console.log('未找到用户部门信息，设置为默认值');
            setDepartment('未分配');
          }

          console.log('用户信息加载完成，用户名:', username);
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
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error('登出失败:', error);
      return false;
    }
  };

  // 确保邮箱存在
  const email = user?.email || '';

  // 构造用户信息对象
  const userInfo = {
    isLoggedIn: !!user,
    userId: user?.id || '',
    email: user?.email || '',
    username: username || email || '未登录用户',
    role: role || '普通用户',
    department: department || '未分配',
    tenantId: tenantId || '',
  };

  return {
    userInfo,
    handleLogout,
    isInitialized,
    isLoading
  };
};
