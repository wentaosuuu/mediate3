
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
  // 记录组件是否已挂载
  const isMounted = useRef(false);
  
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
      await fetchDepartments();
      console.log("部门数据获取完成");
      
      await fetchRoles();
      console.log("角色数据获取完成");
      
      await fetchUsers();
      console.log("用户数据获取完成");
      
      console.log("所有用户相关数据加载完成！");
      // 静默加载成功，不显示提示
    } catch (error) {
      console.error("加载数据过程中发生错误:", error);
      // 仅在外部要求显示错误时才提示
      // 不再自动显示错误提示
    } finally {
      isRefreshing.current = false;
      setIsLoading(false); // 恢复外部加载状态
    }
  }, [fetchDepartments, fetchRoles, fetchUsers]);

  // 仅在组件首次挂载时执行一次数据刷新
  useEffect(() => {
    // 确保只在组件首次挂载时执行一次
    if (!isMounted.current) {
      isMounted.current = true;
      console.log("组件首次挂载，执行数据初始化");
      refreshAllData();
    }
    
    // 清理函数 - 组件卸载时重置状态
    return () => {
      console.log("组件卸载，重置状态");
      isMounted.current = false;
    };
  }, [refreshAllData]); // 依赖refreshAllData确保只执行一次

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
