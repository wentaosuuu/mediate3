import { useEffect } from "react";
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
import {
  Home,
  FileText,
  Phone,
  MessageSquare,
  Bell,
  Users,
  Settings,
  BarChart2,
  BookOpen,
  Building2,
  LogOut,
  Cog,
  UserRound,
  Building,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: Home, label: "首页", path: "/dashboard" },
    { icon: FileText, label: "案件管理", path: "/cases" },
    { icon: Users, label: "调解管理", path: "/mediation" },
    { icon: Phone, label: "呼叫中心", path: "/calls" },
    { icon: MessageSquare, label: "短信管理", path: "/messages" },
    { icon: Bell, label: "通知管理", path: "/notifications" },
    { icon: Building2, label: "租户管理", path: "/tenants" },
    { icon: BarChart2, label: "仪表盘", path: "/stats" },
    { icon: BookOpen, label: "调解记录", path: "/records" },
    { icon: Cog, label: "系统工具", path: "/tools" },
    { icon: ArrowRight, label: "游记菜单", path: "/menu" },
    { icon: UserRound, label: "账户中心", path: "/account" },
    { icon: Building, label: "工作台", path: "/workspace" },
    { icon: Settings, label: "系统管理", path: "/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F5F6FA]">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4 border-b border-gray-200">
            <img
              src="/lovable-uploads/345b6c78-cf53-428b-8148-2d5243378f46.png"
              alt="Logo"
              className="h-8"
            />
          </SidebarHeader>
          <SidebarContent className="py-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.path} 
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg mx-2 mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">退出登录</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">欢迎使用法调云2.0</h1>
            {/* Add your dashboard content here */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;