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
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/quota/statistics"
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
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