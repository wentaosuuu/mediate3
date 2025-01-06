import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/dashboard/Logo";
import { Input } from "@/components/ui/input";
import NotFound from "@/components/NotFound";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  UserRound,
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 将菜单项移到单独的数组中以提高可维护性
const menuItems = [
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [department, setDepartment] = useState("技术部");
  const [role, setRole] = useState("系统管理员");
  const [currentPath, setCurrentPath] = useState("/dashboard");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        setUsername(userData.username);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "退出成功",
        description: "您已成功退出登录",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "退出失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const handleMenuClick = (path: string) => {
    setCurrentPath(path);
    // 这里可以添加实际的路由导航逻辑
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4 border-b border-gray-200 bg-nav">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="py-2 bg-nav">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.path}
                    onClick={() => handleMenuClick(item.path)}
                  >
                    <div className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-nav-hover hover:text-white rounded-lg mx-2 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {item.children && (
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:rotate-90" />
                      )}
                    </div>
                  </SidebarMenuButton>
                  {item.children && (
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.path}>
                          <SidebarMenuSubButton
                            isActive={currentPath === child.path}
                            onClick={() => handleMenuClick(child.path)}
                          >
                            {child.label}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top toolbar */}
          <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <SidebarTrigger />
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="搜索模块、功能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <DropdownMenuItem onClick={() => handleMenuClick('/account/profile')}>
                    <UserRound className="h-4 w-4 mr-2" />
                    个人中心
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuClick('/account/layout')}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    布局设置
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {currentPath === '/dashboard' ? (
                <div className="flex items-center gap-2 mb-6">
                  <Home className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-semibold text-gray-900">
                    欢迎回来, {username || '用户'}
                  </h1>
                </div>
              ) : (
                <NotFound />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;