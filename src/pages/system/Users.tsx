
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import UsersManagement from './users/UsersManagement';
import { Toaster } from 'sonner';

const Users = () => {
  const navigate = useNavigate();

  // 使用正确的用户信息，与Dashboard.tsx保持一致
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
          currentPath="/system/users"
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
        <MainContent username={mockUser.username} currentPath="/system/users">
          <UsersManagement />
        </MainContent>
      </div>
      
      {/* 优化Toaster配置，确保提示正确显示并使用自定义样式 */}
      <Toaster 
        position="top-center" 
        expand={true}
        richColors={false} // 关闭富颜色以使用自定义样式
        closeButton 
        toastOptions={{
          duration: 3000, // 减少提示显示时间，避免太多提示堆积
          className: "text-sm font-medium",
          style: { 
            fontSize: '14px',
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 99999, // 确保在最顶层显示
          }
        }}
      />
    </div>
  );
};

export default Users;
