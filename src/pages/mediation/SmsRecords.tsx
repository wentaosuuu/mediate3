import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { SmsRecordsSearchForm } from '@/components/sms-records/SmsRecordsSearchForm';
import { SmsRecordsTable } from '@/components/sms-records/SmsRecordsTable';

const SmsRecords = () => {
  const navigate = useNavigate();

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
          currentPath="/mediation/sms-records"
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
        <MainContent username={mockUser.username} currentPath="/mediation/sms-records">
          <div className="space-y-4">
            <h1 className="text-xl font-medium text-text-primary">短信发送记录</h1>
            <SmsRecordsSearchForm />
            <SmsRecordsTable />
          </div>
        </MainContent>
      </div>
    </div>
  );
};

export default SmsRecords;