
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import UsersManagement from './users/UsersManagement';
import { Toaster } from 'sonner';

const Users = () => {
  const navigate = useNavigate();

  // 使用正确的用户信息，姓名作为显示名称
  const mockUser = {
    username: '张三', // 姓名
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
      
      {/* 添加Sonner提示组件 */}
      <Toaster 
        position="top-right" 
        expand={true} 
        richColors 
        closeButton 
        toastOptions={{
          duration: 3000,
          style: { fontSize: '14px' }
        }}
      />
    </div>
  );
};

export default Users;
