import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import NotFound from '@/components/NotFound';
import { PageTabs } from './PageTabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from '@/config/menuItems';

interface Tab {
  path: string;
  label: string;
  closeable: boolean;
}

interface MainContentProps {
  username: string | null;
  currentPath: string;
}

const getTabLabel = (path: string): string => {
  // 递归查找菜单项
  const findMenuLabel = (items: any[]): string | null => {
    for (const item of items) {
      if (item.path === path) {
        return item.label;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            return child.label;
          }
        }
      }
    }
    return null;
  };

  if (path === '/dashboard') return '首页';
  
  const label = findMenuLabel(menuItems);
  return label || '未知页面';
};

export const MainContent = ({ username, currentPath }: MainContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs, setTabs] = useState<Tab[]>([
    { path: '/dashboard', label: '首页', closeable: false }
  ]);

  useEffect(() => {
    if (currentPath === '/dashboard') return;

    const tabExists = tabs.some(tab => tab.path === currentPath);
    if (!tabExists) {
      setTabs(prev => [...prev, {
        path: currentPath,
        label: getTabLabel(currentPath),
        closeable: true
      }]);
    }
  }, [currentPath]);

  const handleTabClose = (path: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.path !== path);
      if (path === currentPath) {
        const lastTab = newTabs[newTabs.length - 1];
        navigate(lastTab.path);
      }
      return newTabs;
    });
  };

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const renderContent = () => {
    if (currentPath === '/dashboard') {
      return (
        <div className="flex items-center gap-2 mb-6">
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900">
            欢迎回来, {username || '用户'}
          </h1>
        </div>
      );
    }

    return <NotFound />;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <PageTabs
        tabs={tabs}
        currentPath={currentPath}
        onClose={handleTabClose}
        onTabClick={handleTabClick}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
