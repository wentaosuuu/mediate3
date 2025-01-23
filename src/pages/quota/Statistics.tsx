import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { QuotaStatistics } from '@/components/quota/statistics/QuotaStatistics';

const Statistics = () => {
  const navigate = useNavigate();

  // Mock user data - 实际项目中应该从认证系统获取
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation
        currentPath="/quota/statistics"
        onMenuClick={(path) => navigate(path)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={mockUser.username} currentPath="/quota/statistics">
          <QuotaStatistics />
        </MainContent>
      </div>
    </div>
  );
};

export default Statistics;