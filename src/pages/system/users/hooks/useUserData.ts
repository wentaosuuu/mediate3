
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFetchUsers } from './user-data/useFetchUsers';
import { useFetchDepartments } from './user-data/useFetchDepartments';
import { useFetchRoles } from './user-data/useFetchRoles';
import { toast } from "sonner";

// 整合用户数据钩子
export const useUserData = () => {
  // 使用拆分后的子钩子
  const { 
    users, 
    isLoading: usersLoading, 
    fetchUsers 
  } = useFetchUsers();
  
  const { 
    departments, 
    isLoading: departmentsLoading, 
    fetchDepartments 
  } = useFetchDepartments();
  
  const { 
    roles, 
    isLoading: rolesLoading, 
    fetchRoles 
  } = useFetchRoles();

  // 合并加载状态
  const isLoading = usersLoading || departmentsLoading || rolesLoading;
  
  // 设置加载状态（提供给外部使用）
  const [loadingState, setIsLoading] = useState(false);
  
  // 防止无限循环的锁
  const isRefreshing = useRef(false);
  
  // 包装刷新函数，避免重复创建函数实例导致useEffect无限循环
  const refreshAllData = useCallback(async (): Promise<void> => {
    // 使用 ref 避免并发刷新请求
    if (isRefreshing.current) {
      console.log("数据刷新已在进行中，跳过重复请求");
      return;
    }
    
    console.log("刷新所有用户相关数据...");
    isRefreshing.current = true;
    setIsLoading(true); // 设置外部加载状态为true
    
    try {
      // 依次请求数据，避免并发请求可能导致的问题
      console.log("开始获取部门数据");
      await fetchDepartments();
      console.log("部门数据获取完成");
      
      console.log("开始获取角色数据");
      await fetchRoles();
      console.log("角色数据获取完成");
      
      console.log("开始获取用户数据");
      await fetchUsers();
      console.log("用户数据获取完成");
      
      console.log("所有用户相关数据加载完成！");
    } catch (error) {
      console.error("加载数据过程中发生错误:", error);
      toast.error("加载数据失败：" + (error instanceof Error ? error.message : "未知错误"));
    } finally {
      isRefreshing.current = false;
      setIsLoading(false); // 恢复外部加载状态
    }
  }, [fetchDepartments, fetchRoles, fetchUsers]);

  return {
    users,
    departments,
    roles,
    isLoading: isLoading || loadingState,
    fetchUsers,
    fetchDepartments,
    fetchRoles,
    setIsLoading,
    refreshAllData
  };
};
