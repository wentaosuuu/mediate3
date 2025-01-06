import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { MenuItem as MenuItemType } from '@/types/navigation';
import { SubMenu } from './SubMenu';

interface MenuItemProps {
  item: MenuItemType;
  currentPath: string;
  isExpanded: boolean;
  onMenuClick: (item: MenuItemType) => void;
}

export const MenuItem = ({ item, currentPath, isExpanded, onMenuClick }: MenuItemProps) => {
  return (
    <SidebarMenuItem className="mb-4">
      <SidebarMenuButton
        asChild
        isActive={currentPath === item.path}
        onClick={() => onMenuClick(item)}
      >
        <div className={`
          flex items-center justify-between px-6 py-4 mx-4 rounded-lg 
          transition-all duration-300 linear cursor-pointer text-base
          ${currentPath === item.path 
            ? 'bg-nav-active text-primary' 
            : 'text-gray-300 hover:bg-nav-hover hover:text-white'
          }
        `}>
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {item.children && (
            <ChevronRight 
              className={`h-4 w-4 transition-transform duration-300 linear ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </div>
      </SidebarMenuButton>
      {item.children && (
        <SubMenu
          isExpanded={isExpanded}
          children={item.children}
          currentPath={currentPath}
          onMenuClick={(path) => onMenuClick({ ...item, path })}
        />
      )}
    </SidebarMenuItem>
  );
};