import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { QuotaManager } from '@/components/wallet/QuotaManager';

const Quota = () => {
  const navigate = useNavigate();

  // Mock user data - 实际项目中应该从用户认证系统获取
  const mockUser = {
    username: 'Demo User',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧导航 */}
      <Navigation 
        currentPath="/wallet/quota"
        onMenuClick={(path) => navigate(path)}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        <TopBar 
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <div className="flex-1 overflow-auto pt-16 px-6 pb-6">
          <QuotaManager />
        </div>
      </div>
    </div>
  );
};

// 修改为默认导出
export default Quota;