
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { PurchaseForm } from '@/components/wallet/PurchaseForm';
import { useUserInfo } from '@/hooks/useUserInfo';

const Purchase = () => {
  const navigate = useNavigate();
  const { userInfo, handleLogout } = useUserInfo();

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/wallet/purchase"
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={userInfo.username}
          department={userInfo.department}
          role={userInfo.role}
          onLogout={onLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={userInfo.username} currentPath="/wallet/purchase">
          <PurchaseForm />
        </MainContent>
      </div>
    </div>
  );
};

export default Purchase;
