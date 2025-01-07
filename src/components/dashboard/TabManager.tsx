import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTabs } from './PageTabs';
import { menuItems } from '@/config/menuItems';

interface Tab {
  path: string;
  label: string;
  closeable: boolean;
}

interface TabManagerProps {
  currentPath: string;
}

const getTabLabel = (path: string): string => {
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

export const TabManager = ({ currentPath }: TabManagerProps) => {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<Tab[]>([{
    path: '/dashboard',
    label: '首页',
    closeable: false
  }]);

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

  return (
    <PageTabs
      tabs={tabs}
      currentPath={currentPath}
      onClose={handleTabClose}
      onTabClick={handleTabClick}
    />
  );
};