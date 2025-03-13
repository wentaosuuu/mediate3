
import React from 'react';
import { Bell, ChevronDown, Menu, Search, UserRound, LayoutDashboard, LogOut } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  username: string | null;
  department: string;
  role: string;
  onLogout: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const TopBar = ({
  username,
  department,
  role,
  onLogout,
  onSearch,
  searchQuery,
}: TopBarProps) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5 text-gray-400" />
        </Button>
        <Input
          type="search"
          placeholder="搜索模块、功能..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
              {username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-700">{username || '用户'}</span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{department}</span>
                <span>·</span>
                <span>{role}</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <UserRound className="h-4 w-4 mr-2" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              布局设置
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
