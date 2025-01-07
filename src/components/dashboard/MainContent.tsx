import React from 'react';
import NotFound from '@/components/NotFound';
import { TabManager } from './TabManager';
import { WelcomeContent } from './WelcomeContent';

interface MainContentProps {
  username: string | null;
  currentPath: string;
}

export const MainContent = ({ username, currentPath }: MainContentProps) => {
  const renderContent = () => {
    if (currentPath === '/dashboard') {
      return <WelcomeContent username={username} />;
    }
    return <NotFound />;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <TabManager currentPath={currentPath} />
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};