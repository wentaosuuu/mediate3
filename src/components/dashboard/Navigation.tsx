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
  // 获取当前路径对应的一级菜单路径
  const getCurrentParentPath = (path: string) => {
    for (const item of menuItems) {
      if (item.children) {
        if (item.children.some(child => child.path === path)) {
          return item.path;
        }
      } else if (item.path === path) {
        return item.path;
      }
    }
    return null;
  };

  const [expandedMenu, setExpandedMenu] = useState<string | null>(getCurrentParentPath(currentPath));

  const handleMenuClick = (item: MenuItemType) => {
    if (item.children) {
      // 如果点击的是当前展开的菜单，则折叠
      // 如果点击的是其他菜单，则展开新菜单
      setExpandedMenu(expandedMenu === item.path ? null : item.path);
    } else {
      // 如果是叶子节点，才进行页面跳转
      onMenuClick(item.path);
    }
  };

  const handleSubMenuClick = (path: string) => {
    // 点击子菜单项只进行页面跳转，不折叠菜单
    onMenuClick(path);
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
              onSubMenuClick={handleSubMenuClick}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};