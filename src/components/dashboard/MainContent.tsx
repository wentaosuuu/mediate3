import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import NotFound from '@/components/NotFound';
import { PageTabs } from './PageTabs';
import { useNavigate } from 'react-router-dom';

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
  switch (path) {
    case '/dashboard':
      return '首页';
    case '/mediation/case-info':
      return '案件公示信息';
    case '/mediation/case-info-manage':
      return '案件公示信息管理';
    case '/account/manage':
      return '账户管理';
    case '/global':
      return '全局管理';
    default:
      return '未知页面';
  }
};

export const MainContent = ({ username, currentPath }: MainContentProps) => {
  const navigate = useNavigate();
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
      // If we're closing the current tab, navigate to the last remaining tab
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

  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      <PageTabs
        tabs={tabs}
        currentPath={currentPath}
        onClose={handleTabClose}
        onTabClick={handleTabClick}
      />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {currentPath === '/dashboard' ? (
            <div className="flex items-center gap-2 mb-6">
              <Home className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-gray-900">
                欢迎回来, {username || '用户'}
              </h1>
            </div>
          ) : (
            <NotFound />
          )}
        </div>
      </div>
    </main>
  );
};