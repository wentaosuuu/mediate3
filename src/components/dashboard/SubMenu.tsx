import React from 'react';
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

interface SubMenuProps {
  isExpanded: boolean;
  children: { label: string; path: string; }[];
  currentPath: string;
  onMenuClick: (path: string) => void;
}

export const SubMenu = ({ isExpanded, children, currentPath, onMenuClick }: SubMenuProps) => {
  return (
    <SidebarMenuSub 
      className={`
        overflow-hidden transition-all duration-300 linear
        ${isExpanded 
          ? 'max-h-[800px] opacity-100 mt-3' 
          : 'max-h-0 opacity-0'
        }
      `}
    >
      <div className="py-3 bg-nav-active/30 mx-2 rounded-lg">
        {children.map((child) => (
          <SidebarMenuSubItem key={child.path} className="mb-2 last:mb-0">
            <SidebarMenuSubButton
              isActive={currentPath === child.path}
              onClick={() => onMenuClick(child.path)}
              className={`
                pl-14 pr-4 py-3.5 transition-all duration-300 linear text-sm
                ${currentPath === child.path
                  ? 'text-primary bg-nav-active'
                  : 'text-gray-300 hover:text-white hover:bg-nav-hover'
                }
              `}
            >
              {child.label}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </div>
    </SidebarMenuSub>
  );
};