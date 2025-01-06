import { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/dashboard/Navigation";
import { TopBar } from "@/components/dashboard/TopBar";
import { MainContent } from "@/components/dashboard/MainContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [department, setDepartment] = useState("技术部");
  const [role, setRole] = useState("系统管理员");
  const [currentPath, setCurrentPath] = useState(location.pathname);

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

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

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
    navigate(path);
  };

  // 如果路径不是以 /dashboard 开头，重定向到仪表板
  if (!location.pathname.startsWith('/dashboard') && 
      !location.pathname.startsWith('/case') && 
      !location.pathname.startsWith('/mediation') && 
      !location.pathname.startsWith('/sms') && 
      !location.pathname.startsWith('/call-center') && 
      !location.pathname.startsWith('/mediation-records') && 
      !location.pathname.startsWith('/operation') && 
      !location.pathname.startsWith('/tenant') && 
      !location.pathname.startsWith('/account') && 
      !location.pathname.startsWith('/system') && 
      !location.pathname.startsWith('/global')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100">
        <Navigation 
          currentPath={currentPath}
          onMenuClick={handleMenuClick}
        />
        <div className="flex-1 flex flex-col">
          <TopBar
            username={username}
            department={department}
            role={role}
            onLogout={handleLogout}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
          <MainContent 
            username={username}
            currentPath={currentPath}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;