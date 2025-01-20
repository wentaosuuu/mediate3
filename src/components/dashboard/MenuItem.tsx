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
  onSubMenuClick: (path: string) => void;
}

export const MenuItem = ({ 
  item, 
  currentPath, 
  isExpanded, 
  onMenuClick,
  onSubMenuClick 
}: MenuItemProps) => {
  // 处理菜单项点击
  const handleMenuItemClick = (e: React.MouseEvent) => {
    // 如果是有子菜单的项目，直接触发展开/折叠
    if(item.children) {
      e.preventDefault();
      e.stopPropagation();
      onMenuClick(item);
      return;
    }
    
    // 如果是叶子节点,才进行页面跳转
    onMenuClick(item);
  };

  return (
    <SidebarMenuItem className="mb-4">
      <SidebarMenuButton
        asChild
        isActive={currentPath === item.path}
        onClick={handleMenuItemClick}
      >
        <div className={`
          flex items-center justify-between px-8 py-4 mx-4 rounded-lg 
          transition-all duration-300 linear cursor-pointer text-base w-[calc(100%-32px)]
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
          onMenuClick={onSubMenuClick}
        />
      )}
    </SidebarMenuItem>
  );
};