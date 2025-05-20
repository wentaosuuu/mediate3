
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          console.log('开始获取用户信息，用户ID:', user.id);
          
          // 获取用户基本信息
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('获取用户基本信息失败:', userError);
          } else if (userData) {
            // 设置用户名和租户ID
            setUsername(userData.username || userData.name || user.email || null);
            setTenantId(userData.tenant_id || null);
            
            // 获取用户角色信息 - 使用联表查询
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select(`
                roles:role_id(
                  name
                )
              `)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (roleError) {
              console.error('获取用户角色失败:', roleError);
            } else if (roleData && roleData.roles) {
              setRole(roleData.roles.name || '普通用户');
              console.log('用户角色:', roleData.roles.name);
            } else {
              console.log('未找到用户角色信息');
              setRole('普通用户');
            }
            
            // 获取用户部门信息 - 使用联表查询
            const { data: deptData, error: deptError } = await supabase
              .from('user_departments')
              .select(`
                departments:department_id(
                  name
                )
              `)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (deptError) {
              console.error('获取用户部门失败:', deptError);
            } else if (deptData && deptData.departments) {
              setDepartment(deptData.departments.name || '未分配');
              console.log('用户部门:', deptData.departments.name);
            } else {
              console.log('未找到用户部门信息');
              setDepartment('未分配');
            }
          }
        } catch (error) {
          console.error('获取用户信息异常:', error);
        } finally {
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
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

  const email = user?.email || '';

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
    isInitialized
  };
};
