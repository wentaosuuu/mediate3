import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/dashboard/Navigation";
import { TopBar } from "@/components/dashboard/TopBar";
import { MainContent } from "@/components/dashboard/MainContent";

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
  };

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