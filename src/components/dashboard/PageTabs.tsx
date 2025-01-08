import React from 'react';
import { X, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Tab {
  path: string;
  label: string;
  closeable: boolean;
}

interface PageTabsProps {
  tabs: Tab[];
  currentPath: string;
  onClose: (path: string) => void;
  onTabClick: (path: string) => void;
}

export const PageTabs = ({ tabs, currentPath, onClose, onTabClick }: PageTabsProps) => {
  const navigate = useNavigate();

  // Ensure home tab is always first
  const homeTab = tabs.find(tab => tab.path === '/dashboard');
  const otherTabs = tabs.filter(tab => tab.path !== '/dashboard');
  const sortedTabs = homeTab ? [homeTab, ...otherTabs] : otherTabs;

  return (
    <div className="flex items-center gap-1 px-4 py-1.5 bg-white border-b">
      {sortedTabs.map((tab) => (
        <div
          key={tab.path}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer text-xs
            transition-colors duration-200 ease-in-out
            ${currentPath === tab.path 
              ? 'bg-primary text-white' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }
          `}
          onClick={() => onTabClick(tab.path)}
        >
          {tab.path === '/dashboard' && <Home className="h-3.5 w-3.5" />}
          <span>{tab.label}</span>
          {tab.closeable && (
            <X
              className="h-3.5 w-3.5 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.path);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};