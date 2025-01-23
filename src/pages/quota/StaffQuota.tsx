import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { TabManager } from '@/components/dashboard/TabManager';
import { StaffQuotaForm } from '@/components/quota/staff/StaffQuotaForm';
import { StaffQuotaHistory } from '@/components/quota/staff/StaffQuotaHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StaffQuota = () => {
  const location = useLocation();
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={location.pathname}
          onMenuClick={(path) => navigate(path)}
        />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar
            username={mockUser.username}
            department={mockUser.department}
            role={mockUser.role}
            onLogout={handleLogout}
            onSearch={() => {}}
            searchQuery=""
          />
          <TabManager currentPath={location.pathname} />
        </div>
        <div className="mt-32 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">作业员额度分配</h2>
            </div>
            
            {/* 额度分配表单 */}
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-700">配额设置</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffQuotaForm />
              </CardContent>
            </Card>

            {/* 历史记录 */}
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-700">历史记录</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffQuotaHistory />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffQuota;