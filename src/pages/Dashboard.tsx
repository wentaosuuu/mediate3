
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { useUserInfo } from '@/hooks/useUserInfo';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // 使用useUserInfo钩子获取用户信息
  const { userInfo, handleLogout } = useUserInfo();

  // 处理退出登录
  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={location.pathname}
          onMenuClick={handleMenuClick}
        />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar
            username={userInfo.username}
            department={userInfo.department}
            role={userInfo.role}
            onLogout={onLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </div>
        <div className="mt-16">
          <MainContent
            username={userInfo.username}
            currentPath={location.pathname}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
