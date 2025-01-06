import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Logo } from './Logo';
import { MenuItem as MenuItemType } from '@/types/navigation';
import { MenuItem } from './MenuItem';
import { menuItems } from '@/config/menuItems';

interface NavigationProps {
  currentPath: string;
  onMenuClick: (path: string) => void;
}

export const Navigation = ({ currentPath, onMenuClick }: NavigationProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleMenuClick = (item: MenuItemType) => {
    if (item.children) {
      // 如果有子菜单，只切换展开状态
      setExpandedMenu(prev => prev === item.path ? null : item.path);
    } else {
      // 如果是叶子节点，才进行页面跳转
      onMenuClick(item.path);
    }
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="flex justify-center items-center p-4 border-b border-gray-200 bg-nav">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="py-8 bg-nav">
        <SidebarMenu>
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              currentPath={currentPath}
              isExpanded={expandedMenu === item.path}
              onMenuClick={handleMenuClick}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};