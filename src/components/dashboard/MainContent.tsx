import React from 'react';
import { TabManager } from './TabManager';

interface MainContentProps {
  username: string | null;
  currentPath: string;
  children?: React.ReactNode;
}

export const MainContent = ({ username, currentPath, children }: MainContentProps) => {
  const renderContent = () => {
    if (currentPath === '/dashboard') {
      return <div className="p-6">欢迎回来, {username}!</div>;
    }
    return children;
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