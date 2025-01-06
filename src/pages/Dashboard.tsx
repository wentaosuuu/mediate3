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
    { icon: Phone, label: "呼叫中心", path: "/calls" },
    { icon: MessageSquare, label: "短信管理", path: "/messages" },
    { icon: Bell, label: "通知管理", path: "/notifications" },
    { icon: Users, label: "调解记录", path: "/mediation" },
    { icon: BarChart2, label: "仪表盘", path: "/stats" },
    { icon: Building2, label: "租户管理", path: "/tenants" },
    { icon: BookOpen, label: "系统监控", path: "/monitor" },
    { icon: Settings, label: "系统管理", path: "/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <img
              src="/lovable-uploads/345b6c78-cf53-428b-8148-2d5243378f46.png"
              alt="Logo"
              className="h-8"
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                  <LogOut className="h-4 w-4" />
                  <span>退出登录</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">欢迎使用法调云2.0</h1>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;