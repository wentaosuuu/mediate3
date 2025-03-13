
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 用户数据钩子
export const useUserData = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取用户列表
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // 不尝试获取 department_id，因为该字段在 users 表中不存在
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          username, 
          email, 
          phone, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) throw error;
      
      // 用户数据获取成功后，加载部门信息
      console.log("获取到的用户列表原始数据:", data);
      
      // 将用户数据映射为前端需要的格式
      const formattedUsers = (data || []).map(user => {
        return {
          ...user,
          department_name: '-' // 默认为无部门
        };
      });
      
      console.log("格式化后的用户列表:", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      toast({
        title: "获取用户列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('获取部门列表失败:', error);
      toast({
        title: "获取部门列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      // 如果角色表还未创建，使用模拟数据
      setRoles([
        { id: '1', name: '管理员' },
        { id: '2', name: '普通用户' }
      ]);
    }
  };

  // 初始加载
  useEffect(() => {
    // 顺序加载数据
    const loadData = async () => {
      await fetchDepartments();
      await fetchRoles();
      await fetchUsers();
    };
    
    loadData();
  }, []);

  return {
    users,
    departments,
    roles,
    isLoading,
    fetchUsers,
    setIsLoading
  };
};
