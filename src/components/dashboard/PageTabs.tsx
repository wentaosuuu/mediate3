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
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b">
      {tabs.map((tab) => (
        <div
          key={tab.path}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
            ${currentPath === tab.path 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          onClick={() => onTabClick(tab.path)}
        >
          <span className="text-sm">{tab.label}</span>
          {tab.closeable && (
            <X
              className="h-4 w-4 hover:text-red-500"
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