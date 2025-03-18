
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
        // 这里使用模拟用户ID，实际项目中应该从认证系统获取
        const userId = "mock-user-id"; // 实际应用中替换为真实用户ID
        
        // 获取用户基本信息
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username, name')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        // 获取用户部门信息
        const { data: userDept, error: deptError } = await supabase
          .from('user_departments')
          .select('departments:department_id(name)')
          .eq('user_id', userId)
          .maybeSingle();
          
        // 获取用户角色信息  
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('roles:role_id(name)')
          .eq('user_id', userId)
          .maybeSingle();
          
        setUserInfo({
          username: userData?.username || userData?.name || '用户',
          department: userDept?.departments?.name || '无部门',
          role: userRole?.roles?.name || '无角色'
        });
        
      } catch (error) {
        console.error("获取用户信息失败:", error);
        // 出错时使用默认值
        setUserInfo({
          username: '张三', // 默认用户名
          department: '技术部',
          role: '管理员'
        });
      }
    };
    
    // 由于目前可能没有真实用户认证，我们直接使用模拟数据
    // fetchUserInfo(); // 实际项目中取消注释此行
    
    // 使用模拟数据
    setUserInfo({
      username: '张三',
      department: '技术部',
      role: '管理员'
    });
    
  }, []);

  const handleLogout = () => {
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
