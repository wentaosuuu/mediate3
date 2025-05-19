
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
          // 确保从正确的表中获取用户信息
          const { data, error } = await supabase
            .from('users')
            .select('*')  // 先使用通配符查询所有字段
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('获取用户信息失败:', error);
          } else if (data) {
            // 安全地设置字段值，避免类型错误
            setUsername(data.username || null);
            setRole(data.role || null);
            setDepartment(data.department || null);
            setTenantId(data.tenant_id || null);
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
