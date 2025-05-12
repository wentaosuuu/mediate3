import { useState, useEffect } from 'react';

interface UserInfo {
  id: string;
  username: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  department: string;
  role: string;
  tenantId: string;
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '1',
    username: '管理员',
    email: 'admin@example.com',
    name: '系统管理员',
    phone: '13800138000',
    department: '系统管理部',
    role: '系统管理员',
    tenantId: 'default-tenant'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 模拟登录
  const handleLogin = async (username: string, password: string) => {
    // 这里应该是真实的登录API调用
    if (username && password) {
      setIsLoggedIn(true);
      // 更新用户信息，包括租户ID
      setUserInfo({
        id: '1',
        username: username,
        email: `${username}@example.com`,
        name: '系统用户',
        phone: '13800138000',
        department: '系统管理部',
        role: '系统管理员',
        tenantId: 'default-tenant'
      });
      return true;
    }
    return false;
  };

  // 模拟登出
  const handleLogout = async () => {
    // 这里应该是真实的登出API调用
    setIsLoggedIn(false);
    return true;
  };

  return {
    userInfo,
    isLoggedIn,
    handleLogin,
    handleLogout
  };
};
