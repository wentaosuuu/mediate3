import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { SidebarProvider } from '@/components/ui/sidebar';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data - replace with actual user data later
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-gray-100">
        <Navigation
          currentPath={location.pathname}
          onMenuClick={handleMenuClick}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar
            username={mockUser.username}
            department={mockUser.department}
            role={mockUser.role}
            onLogout={handleLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
          <MainContent
            username={mockUser.username}
            currentPath={location.pathname}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;