
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * 用户信息钩子 - 提供用户认证状态和用户信息
 */
export const useUserInfo = () => {
  const user = useUser();
  const [userInfo, setUserInfo] = useState({
    isLoggedIn: false,
    userId: '',
    email: '',
    username: '未登录用户',
    role: '普通用户',
    department: '未分配',
    tenantId: '',
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      console.log('开始获取用户信息，用户:', user);
      
      try {
        if (user) {
          console.log('开始获取用户信息，用户ID:', user.id);
          
          let displayName = user.email?.split('@')[0] || '用户';
          let userRole = '普通用户';
          let userDepartment = '未分配';
          let userTenantId = '';
          
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
            displayName = userData.name || userData.username || user.email?.split('@')[0] || '用户';
            userTenantId = userData.tenant_id || '';
            console.log('设置用户名为:', displayName);
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
          } else if (roleData && roleData.roles) {
            console.log('找到用户角色:', roleData.roles.name);
            userRole = roleData.roles.name;
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
          } else if (deptData && deptData.departments) {
            console.log('找到用户部门:', deptData.departments.name);
            userDepartment = deptData.departments.name;
          }

          // 设置完整的用户信息
          const newUserInfo = {
            isLoggedIn: true,
            userId: user.id,
            email: user.email || '',
            username: displayName,
            role: userRole,
            department: userDepartment,
            tenantId: userTenantId,
          };
          
          console.log('设置新的用户信息:', newUserInfo);
          setUserInfo(newUserInfo);
        } else {
          // 用户未登录，重置所有状态
          console.log('用户未登录，重置状态');
          setUserInfo({
            isLoggedIn: false,
            userId: '',
            email: '',
            username: '未登录用户',
            role: '普通用户',
            department: '未分配',
            tenantId: '',
          });
        }
      } catch (error) {
        console.error('获取用户信息异常:', error);
        // 设置默认值以防出错
        if (user) {
          setUserInfo({
            isLoggedIn: true,
            userId: user.id,
            email: user.email || '',
            username: user.email?.split('@')[0] || '用户',
            role: '普通用户',
            department: '未分配',
            tenantId: '',
          });
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

  console.log('当前返回的用户信息:', userInfo);

  return {
    userInfo,
    handleLogout,
    isInitialized,
    isLoading
  };
};
