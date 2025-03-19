
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import RolesManagement from './roles/RolesManagement';
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from 'sonner';

const Roles = () => {
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
          username: userData?.name || userData?.username || '用户', // 优先使用姓名字段
          department: userDept?.departments?.name || '无部门',
          role: userRole?.roles?.name || '无角色'
        });
        
      } catch (error) {
        console.error("获取用户信息失败:", error);
        // 出错时使用默认值
        setUserInfo({
          username: '张三',
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/system/roles"
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={userInfo.username}
          department={userInfo.department}
          role={userInfo.role}
          onLogout={handleLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={userInfo.username} currentPath="/system/roles">
          <RolesManagement />
        </MainContent>
      </div>
      
      <Toaster 
        position="top-center" 
        expand={true}
        richColors={false}
        closeButton 
        toastOptions={{
          duration: 3000,
          className: "text-sm font-medium",
          style: { 
            fontSize: '14px',
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 99999,
          }
        }}
      />
    </div>
  );
};

export default Roles;
