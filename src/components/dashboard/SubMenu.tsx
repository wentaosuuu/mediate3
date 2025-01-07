import React from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { MenuItem } from '@/types/navigation';

interface SubMenuProps {
  isExpanded: boolean;
  children: { label: string; path: string; }[];
  currentPath: string;
  onMenuClick: (path: string) => void;
}

export const SubMenu = ({ isExpanded, children, currentPath, onMenuClick }: SubMenuProps) => {
  return (
    <SidebarMenu 
      className={`
        overflow-hidden transition-all duration-300 linear
        ${isExpanded 
          ? 'max-h-[800px] opacity-100 mt-3' 
          : 'max-h-0 opacity-0'
        }
      `}
    >
      <div className="py-3 bg-nav-active/30 mx-4 rounded-lg">
        {children.map((child) => (
          <SidebarMenuItem key={child.path}>
            <SidebarMenuButton
              isActive={currentPath === child.path}
              onClick={() => onMenuClick(child.path)}
              className={`
                pl-14 pr-8 py-3.5 transition-all duration-300 linear text-sm w-[calc(100%-16px)] mx-2
                ${currentPath === child.path
                  ? 'text-primary bg-nav-active'
                  : 'text-gray-300 hover:text-white hover:bg-nav-hover'
                }
              `}
            >
              {child.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </div>
    </SidebarMenu>
  );
};