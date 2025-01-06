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
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Users,
  BarChart2,
  Bell,
  BookOpen,
  UserCog,
  Activity,
  TestTube2,
  UserRound,
  Network,
  ClipboardList,
  Settings,
  Search,
  LogOut,
  ChevronDown,
  Home,
  MessageSquare,
  Star,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Home, label: "首页", path: "/dashboard" },
  { icon: FileText, label: "案件管理", path: "/cases" },
  { icon: MessageSquare, label: "调解管理", path: "/mediation" },
  { icon: BarChart2, label: "仪表盘", path: "/stats" },
  { icon: Bell, label: "通知中心", path: "/notifications" },
  { icon: BookOpen, label: "调解记录", path: "/records" },
  { icon: UserCog, label: "超用户管理", path: "/super-admin" },
  { icon: Activity, label: "系统监控", path: "/monitoring" },
  { icon: TestTube2, label: "测试菜单", path: "/test" },
  { icon: UserRound, label: "账户中心", path: "/account" },
  { icon: Network, label: "工作流", path: "/workflow" },
  { icon: Star, label: "流程草单", path: "/drafts" },
  { icon: Briefcase, label: "PLUS专区", path: "/plus" },
  { icon: ClipboardList, label: "我的任务", path: "/tasks" },
  { icon: Settings, label: "系统管理", path: "/settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      // Fetch user data
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4 border-b border-gray-200 bg-nav">
            <img
              src="/lovable-uploads/345b6c78-cf53-428b-8148-2d5243378f46.png"
              alt="Logo"
              className="h-8"
            />
          </SidebarHeader>
          <SidebarContent className="py-2 bg-nav">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.path} 
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-nav-hover hover:text-white rounded-lg mx-2 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top toolbar */}
          <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
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
                  <span className="text-sm text-gray-700">{username || '用户'}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <UserRound className="h-4 w-4 mr-2" />
                    账户设置
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
              <div className="flex items-center gap-2 mb-6">
                <Home className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold text-gray-900">
                  欢迎回来, {username || '用户'}
                </h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">
                  选择左侧菜单以开始使用系统功能。
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;