
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    username: '加载中...',
    department: '加载中...',
    role: '加载中...'
  });

  // 获取用户部门和角色信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 获取当前登录用户
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          console.warn("未找到登录用户，使用模拟数据");
          // 如果没有登录用户，使用模拟数据（开发模式）
          setUserInfo({
            username: '张三',
            department: '云宝宝',
            role: '云宝人员'
          });
          return;
        }
        
        console.log("当前登录用户ID:", user.id);
        
        // 获取用户基本信息
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username, name')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        // 获取用户部门信息
        const { data: userDept, error: deptError } = await supabase
          .from('user_departments')
          .select('departments:department_id(name)')
          .eq('user_id', user.id)
          .maybeSingle();
          
        // 获取用户角色信息  
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('roles:role_id(name)')
          .eq('user_id', user.id)
          .maybeSingle();
          
        setUserInfo({
          username: userData?.username || userData?.name || '用户',
          department: userDept?.departments?.name || '无部门',
          role: userRole?.roles?.name || '无角色'
        });
        
        console.log("已加载用户信息:", {
          username: userData?.username || userData?.name,
          department: userDept?.departments?.name,
          role: userRole?.roles?.name
        });
        
      } catch (error) {
        console.error("获取用户信息失败:", error);
        toast.error("获取用户信息失败，使用默认数据");
        // 出错时使用默认值
        setUserInfo({
          username: '张三', // 默认用户名
          department: '云宝宝',
          role: '云宝人员'
        });
      }
    };
    
    // 调用获取用户信息函数
    fetchUserInfo();
    
  }, []);

  const handleLogout = async () => {
    // 退出登录时清除supabase session
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={location.pathname}
          onMenuClick={handleMenuClick}
        />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar
            username={userInfo.username}
            department={userInfo.department}
            role={userInfo.role}
            onLogout={handleLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </div>
        <div className="mt-16">
          <MainContent
            username={userInfo.username}
            currentPath={location.pathname}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
