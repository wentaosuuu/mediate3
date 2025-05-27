
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * 用户信息钩子 - 提供用户认证状态和用户信息
 */
export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null);
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

  // 获取用户详细信息的函数
  const fetchUserDetails = async (currentUser: User) => {
    try {
      console.log('开始获取用户详细信息，用户ID:', currentUser.id);
      
      let displayName = currentUser.email?.split('@')[0] || '用户';
      let userRole = '普通用户';
      let userDepartment = '未分配';
      let userTenantId = '';
      
      // 获取用户基本信息
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (userError) {
        console.error('获取用户基本信息失败:', userError);
      } else if (userData) {
        console.log('获取到用户基本信息:', userData);
        // 优先使用 name 字段，其次是 username，最后是邮箱前缀
        displayName = userData.name || userData.username || currentUser.email?.split('@')[0] || '用户';
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
        .eq('user_id', currentUser.id)
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
        .eq('user_id', currentUser.id)
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
        userId: currentUser.id,
        email: currentUser.email || '',
        username: displayName,
        role: userRole,
        department: userDepartment,
        tenantId: userTenantId,
      };
      
      console.log('设置新的用户信息:', newUserInfo);
      setUserInfo(newUserInfo);
      
    } catch (error) {
      console.error('获取用户信息异常:', error);
      // 设置默认值以防出错
      setUserInfo({
        isLoggedIn: true,
        userId: currentUser.id,
        email: currentUser.email || '',
        username: currentUser.email?.split('@')[0] || '用户',
        role: '普通用户',
        department: '未分配',
        tenantId: '',
      });
    }
  };

  useEffect(() => {
    console.log('useUserInfo: 开始初始化');
    
    // 1. 首先获取当前会话
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('获取会话失败:', error);
          return;
        }
        
        console.log('当前会话:', session);
        if (session?.user) {
          setUser(session.user);
          await fetchUserDetails(session.user);
        } else {
          console.log('用户未登录，重置状态');
          setUser(null);
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
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    // 2. 设置认证状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session);
        
        if (session?.user) {
          setUser(session.user);
          // 延迟一下确保数据库更新完成
          setTimeout(async () => {
            await fetchUserDetails(session.user);
          }, 100);
        } else {
          console.log('用户登出，重置状态');
          setUser(null);
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
        
        if (!isInitialized) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    );

    // 初始化会话
    getInitialSession();

    // 清理函数
    return () => {
      console.log('useUserInfo: 清理订阅');
      subscription.unsubscribe();
    };
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const handleLogout = async () => {
    try {
      console.log('开始登出');
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error('登出失败:', error);
      return false;
    }
  };

  console.log('useUserInfo 返回的用户信息:', userInfo);

  return {
    userInfo,
    handleLogout,
    isInitialized,
    isLoading,
    // 添加手动刷新用户信息的方法
    refreshUserInfo: user ? () => fetchUserDetails(user) : () => Promise.resolve(),
  };
};
