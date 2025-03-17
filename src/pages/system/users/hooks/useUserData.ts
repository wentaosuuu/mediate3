
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFetchUsers } from './user-data/useFetchUsers';
import { useFetchDepartments } from './user-data/useFetchDepartments';
import { useFetchRoles } from './user-data/useFetchRoles';

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
  
  // 使用 ref 来防止重复加载
  const initialLoadDone = useRef(false);
  const isRefreshing = useRef(false);
  
  // 包装刷新函数，避免重复创建函数实例导致useEffect无限循环
  const refreshAllData = useCallback(async () => {
    // 使用 ref 避免并发刷新请求
    if (isRefreshing.current) {
      console.log("数据刷新已在进行中，跳过重复请求");
      return;
    }
    
    console.log("刷新所有用户相关数据...");
    isRefreshing.current = true;
    
    try {
      // 依次请求数据，避免并发请求可能导致的问题
      await fetchDepartments();
      await fetchRoles();
      await fetchUsers();
      console.log("所有用户相关数据加载完成！");
    } catch (error) {
      console.error("加载数据过程中发生错误:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [fetchDepartments, fetchRoles, fetchUsers]);

  // 初始加载 - 使用 useRef 确保只加载一次
  useEffect(() => {
    if (!initialLoadDone.current) {
      console.log("首次加载所有用户相关数据...");
      refreshAllData();
      initialLoadDone.current = true;
    }
  }, [refreshAllData]);

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
