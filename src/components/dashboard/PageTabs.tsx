import React from 'react';
import { X } from 'lucide-react';
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
  return (
    <div className="flex items-center gap-1 px-4 py-1.5 bg-white border-b">
      {tabs.map((tab) => (
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