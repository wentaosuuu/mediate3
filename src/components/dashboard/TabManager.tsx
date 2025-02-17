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
  const [tabs, setTabs] = useState<Tab[]>(() => {
    try {
      // 从 localStorage 恢复标签页状态
      const savedTabs = localStorage.getItem('openTabs');
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs);
        // 确保首页标签始终存在
        if (!parsedTabs.find((tab: Tab) => tab.path === '/dashboard')) {
          parsedTabs.unshift({
            path: '/dashboard',
            label: '首页',
            closeable: false
          });
        }
        return parsedTabs;
      }
    } catch (error) {
      console.error('Error loading tabs from localStorage:', error);
    }
    // 如果出现任何错误或没有保存的标签，返回默认值
    return [{
      path: '/dashboard',
      label: '首页',
      closeable: false
    }];
  });

  // 保存标签页状态到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('openTabs', JSON.stringify(tabs));
    } catch (error) {
      console.error('Error saving tabs to localStorage:', error);
    }
  }, [tabs]);

  // 处理新标签页的添加
  useEffect(() => {
    if (currentPath === '/dashboard') return;

    setTabs(prev => {
      // 检查当前路径的标签是否已存在
      const existingTab = prev.find(tab => tab.path === currentPath);
      
      if (!existingTab) {
        // 如果标签不存在，添加新标签
        return [
          ...prev,
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
      
      // 确保至少保留首页标签
      if (newTabs.length === 0) {
        newTabs.push({
          path: '/dashboard',
          label: '首页',
          closeable: false
        });
      }

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