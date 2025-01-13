import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';

const SmsService = () => {
  const navigate = useNavigate();

  // Mock user data
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
          currentPath="/mediation/sms-service"
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
        <MainContent username={mockUser.username} currentPath="/mediation/sms-service">
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">短信触达服务</h1>
            {/* Content will be added in future iterations */}
          </div>
        </MainContent>
      </div>
    </div>
  );
};

export default SmsService;