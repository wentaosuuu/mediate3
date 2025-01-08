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
  const [tabs, setTabs] = useState<Tab[]>([]);

  // 初始化标签页，确保首页标签始终存在
  useEffect(() => {
    setTabs([{
      path: '/dashboard',
      label: '首页',
      closeable: false
    }]);
  }, []);

  // 处理新标签页的添加
  useEffect(() => {
    if (currentPath === '/dashboard') return;

    setTabs(prev => {
      // 确保首页标签存在
      const homeTab = prev.find(tab => tab.path === '/dashboard');
      const otherTabs = prev.filter(tab => tab.path !== '/dashboard');
      
      // 检查当前路径的标签是否已存在
      const currentTab = [...otherTabs, homeTab].find(tab => tab?.path === currentPath);
      
      if (!currentTab) {
        // 如果标签不存在，添加新标签
        return [
          homeTab || { path: '/dashboard', label: '首页', closeable: false },
          ...otherTabs,
          {
            path: currentPath,
            label: getTabLabel(currentPath),
            closeable: true
          }
        ];
      }
      
      return prev;
    });
  }, [currentPath]);

  const handleTabClose = (path: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.path !== path);
      if (path === currentPath) {
        // 如果关闭的是当前标签，跳转到最后一个标签
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