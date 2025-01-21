import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { QuotaManager } from '@/components/wallet/QuotaManager';
import { MainContent } from '@/components/dashboard/MainContent';

// 定义 Quota 组件
const Quota: React.FC = () => {
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

  const [searchQuery, setSearchQuery] = React.useState('');

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
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />
        <MainContent 
          username={mockUser.username}
          currentPath="/wallet/quota"
        >
          <QuotaManager />
        </MainContent>
      </div>
    </div>
  );
};

// 使用 export default 导出组件
export default Quota;