
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// 用户信息接口定义
export interface UserInfo {
  username: string;
  department: string;
  role: string;
}

/**
 * 用户信息获取自定义钩子
 * 负责从Supabase获取当前登录用户的基本信息、部门和角色
 */
export const useUserInfo = () => {
  // 用户信息状态
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '加载中...',
    department: '加载中...',
    role: '加载中...'
  });
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);

  // 获取用户部门和角色信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
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
          setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    // 调用获取用户信息函数
    fetchUserInfo();
    
  }, []);

  return {
    userInfo,
    isLoading
  };
};
