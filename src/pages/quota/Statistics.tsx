
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { QuotaStatistics } from '@/components/quota/statistics/QuotaStatistics';

const Statistics = () => {
  const navigate = useNavigate();

  // Mock user data - 更新为正确的用户信息
  const mockUser = {
    username: '张三',
    department: '云宝宝',
    role: '云宝人员'
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
