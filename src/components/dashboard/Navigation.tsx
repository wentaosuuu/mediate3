import React, { useState } from 'react';
import {
  Home,
  FileText,
  MessageSquare,
  BarChart2,
  MessageCircle,
  PhoneCall,
  BookOpen,
  LineChart,
  Building2,
  UserCircle,
  Settings,
  Globe,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Logo } from './Logo';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  children?: { label: string; path: string; }[];
}

const menuItems: MenuItem[] = [
  { 
    icon: Home, 
    label: "首页", 
    path: "/dashboard"
  },
  { 
    icon: FileText, 
    label: "案件管理", 
    path: "/case",
    children: [
      { label: "分案管理", path: "/case/distribution" }
    ]
  },
  { 
    icon: MessageSquare, 
    label: "调解管理", 
    path: "/mediation",
    children: [
      { label: "调解中心", path: "/mediation/center" },
      { label: "债务人管理", path: "/mediation/debtor" },
      { label: "案件公示信息", path: "/mediation/case-info" },
      { label: "案件公示信息管理", path: "/mediation/case-info-manage" }
    ]
  },
  { 
    icon: BarChart2, 
    label: "仪表盘", 
    path: "/dashboard-stats",
    children: [
      { label: "短信数据看板", path: "/dashboard-stats/sms" },
      { label: "通信数据看板", path: "/dashboard-stats/communication" }
    ]
  },
  { 
    icon: MessageCircle, 
    label: "短信管理", 
    path: "/sms",
    children: [
      { label: "短信类型配置", path: "/sms/type-config" },
      { label: "短信模板配置", path: "/sms/template-config" }
    ]
  },
  { 
    icon: PhoneCall, 
    label: "呼叫中心", 
    path: "/call-center",
    children: [
      { label: "主叫管理", path: "/call-center/caller" },
      { label: "坐席管理", path: "/call-center/seat" },
      { label: "工号坐席管理", path: "/call-center/work-number-seat" },
      { label: "工号管理", path: "/call-center/work-number" },
      { label: "信修虚拟号管理", path: "/call-center/virtual-number" },
      { label: "信修坐席管理", path: "/call-center/credit-seat" }
    ]
  },
  { 
    icon: BookOpen, 
    label: "调解记录", 
    path: "/mediation-records",
    children: [
      { label: "修复批次", path: "/mediation-records/repair-batch" },
      { label: "信修通话记录", path: "/mediation-records/credit-call" },
      { label: "修复记录", path: "/mediation-records/repair" },
      { label: "通话记录", path: "/mediation-records/call" },
      { label: "短信批次", path: "/mediation-records/sms-batch" },
      { label: "短信记录", path: "/mediation-records/sms" }
    ]
  },
  { 
    icon: LineChart, 
    label: "运营中心", 
    path: "/operation",
    children: [
      { label: "隐私设置", path: "/operation/privacy" },
      { label: "短信触达批次", path: "/operation/sms-reach" }
    ]
  },
  { 
    icon: Building2, 
    label: "租户管理", 
    path: "/tenant",
    children: [
      { label: "租户管理", path: "/tenant/manage" },
      { label: "租户套餐管理", path: "/tenant/package" }
    ]
  },
  { 
    icon: UserCircle, 
    label: "账户中心", 
    path: "/account",
    children: [
      { label: "账户管理", path: "/account/manage" },
      { label: "账户消费总表", path: "/account/consumption" },
      { label: "充值记录", path: "/account/recharge" }
    ]
  },
  { 
    icon: Settings, 
    label: "系统管理", 
    path: "/system",
    children: [
      { label: "用户管理", path: "/system/users" },
      { label: "角色管理", path: "/system/roles" },
      { label: "菜单管理", path: "/system/menus" },
      { label: "部门管理", path: "/system/departments" },
      { label: "岗位管理", path: "/system/positions" },
      { label: "字典管理", path: "/system/dictionaries" },
      { label: "参数设置", path: "/system/parameters" },
      { label: "通知公告", path: "/system/notifications" },
      { label: "日志管理", path: "/system/logs" },
      { label: "文件管理", path: "/system/files" },
      { label: "客户端管理", path: "/system/clients" }
    ]
  },
  { 
    icon: Globe, 
    label: "全局管理", 
    path: "/global"
  }
];

interface NavigationProps {
  currentPath: string;
  onMenuClick: (path: string) => void;
}

export const Navigation = ({ currentPath, onMenuClick }: NavigationProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (path: string) => {
    setExpandedMenu(prev => prev === path ? null : path);
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="flex justify-center items-center p-4 border-b border-gray-200 bg-nav">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="py-6 bg-nav">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label} className="mb-2">
              <SidebarMenuButton
                asChild
                isActive={currentPath === item.path}
                onClick={() => {
                  onMenuClick(item.path);
                  if (item.children) {
                    toggleMenu(item.path);
                  }
                }}
              >
                <div className={`
                  flex items-center justify-between px-4 py-3.5 mx-2 rounded-lg 
                  transition-colors cursor-pointer text-base
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
                      className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                        expandedMenu === item.path ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </div>
              </SidebarMenuButton>
              {item.children && (
                <SidebarMenuSub 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${expandedMenu === item.path 
                      ? 'max-h-[500px] opacity-100 mt-2' 
                      : 'max-h-0 opacity-0'
                    }
                  `}
                >
                  <div className="py-2 bg-nav-active/30 mx-2 rounded-lg">
                    {item.children.map((child) => (
                      <SidebarMenuSubItem key={child.path} className="mb-1 last:mb-0">
                        <SidebarMenuSubButton
                          isActive={currentPath === child.path}
                          onClick={() => onMenuClick(child.path)}
                          className={`
                            pl-14 pr-4 py-3 transition-colors text-sm
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
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};