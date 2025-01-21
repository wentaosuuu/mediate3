import React from 'react';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { QuotaManager } from '@/components/wallet/QuotaManager';

// Mock user data - 实际项目中应该从用户认证系统获取
const mockUser = {
  username: 'Demo User',
  avatar: '/placeholder.svg'
};

export const Quota = () => {
  return (
    <div className="min-h-screen flex">
      {/* 左侧导航 */}
      <Navigation />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        <TopBar 
          username={mockUser.username}
          avatar={mockUser.avatar}
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