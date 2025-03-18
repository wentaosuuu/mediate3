
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 获取用户数据的钩子
 * 包含用户数据获取、刷新和加载状态的管理
 */
export const useFetchUsers = () => {
  // 用户数据
  const [users, setUsers] = useState<any[]>([]);
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * 获取用户数据
   * 同时获取用户的部门和角色信息，并进行关联处理
   */
  const fetchUsers = useCallback(async (): Promise<void> => {
    console.log("开始获取用户数据...");
    setIsLoading(true);
    
    try {
      // 获取用户
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, name, email, phone, tenant_id, created_at')
        .order('created_at', { ascending: false });
        
      if (userError) {
        console.error("获取用户数据失败:", userError);
        toast.error(`获取用户数据失败: ${userError.message}`);
        throw userError;
      }
      
      if (!userData || userData.length === 0) {
        console.log("未获取到用户数据");
        setUsers([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`获取到 ${userData.length} 条用户数据`);
      
      // 获取用户-部门关联
      const { data: userDepartments, error: deptError } = await supabase
        .from('user_departments')
        .select('user_id, department_id, departments:department_id(id, name)')
        .returns<any[]>();
      
      if (deptError) {
        console.error("获取用户-部门关联失败:", deptError);
        toast.error(`获取部门关联信息失败: ${deptError.message}`);
      }
      
      console.log("用户-部门关联数据:", userDepartments);
      
      // 获取用户-角色关联
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role_id, roles:role_id(id, name)')
        .returns<any[]>();
      
      if (roleError) {
        console.error("获取用户-角色关联失败:", roleError);
        toast.error(`获取角色关联信息失败: ${roleError.message}`);
      }
      
      console.log("用户-角色关联数据:", userRoles);
      
      // 合并用户数据、部门和角色信息
      const enhancedUsers = userData.map(user => {
        // 查找用户对应的部门信息
        const userDept = userDepartments?.filter(d => d.user_id === user.id) || [];
        // 查找用户对应的角色信息
        const userRole = userRoles?.filter(r => r.user_id === user.id) || [];
        
        const enhancedUser = {
          ...user,
          // 添加部门相关字段
          department_id: userDept[0]?.department_id || "",
          department_name: userDept[0]?.departments?.name || "无部门",
          // 添加角色相关字段
          role_id: userRole[0]?.role_id || "",
          role_name: userRole[0]?.roles?.name || "无角色",
        };
        
        return enhancedUser;
      });
      
      console.log("已合并用户、部门和角色数据:", enhancedUsers);
      setUsers(enhancedUsers);
    } catch (error) {
      console.error("获取用户数据失败:", error);
      toast.error(`获取用户数据失败: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      console.log("用户数据获取操作完成");
    }
  }, []);
  
  // 页面加载时获取数据
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return { users, isLoading, fetchUsers };
};
