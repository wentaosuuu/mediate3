
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import UsersManagement from './users/UsersManagement';
import { Toaster } from 'sonner';
import { useUserInfo } from '@/hooks/useUserInfo';

const Users = () => {
  const navigate = useNavigate();
  
  // 使用useUserInfo钩子获取用户信息
  const { userInfo, handleLogout, isInitialized, isLoading } = useUserInfo();
  
  useEffect(() => {
    console.log("Users页面 - 当前用户信息:", userInfo);
  }, [userInfo]);

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/');
    }
  };

  // 等待用户信息初始化完成
  if (!isInitialized || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">加载用户信息中...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/system/users"
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={userInfo.username}
          department={userInfo.department}
          role={userInfo.role}
          onLogout={onLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={userInfo.username} currentPath="/system/users">
          <UsersManagement />
        </MainContent>
      </div>
      
      <Toaster 
        position="top-center" 
        expand={true}
        richColors={false}
        closeButton 
        toastOptions={{
          duration: 3000,
          className: "text-sm font-medium",
          style: { 
            fontSize: '14px',
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 99999,
          }
        }}
      />
    </div>
  );
};

export default Users;
