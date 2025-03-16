
import { useState, useEffect, useCallback } from 'react';
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
  
  // 包装刷新函数，避免重复创建函数实例导致useEffect无限循环
  const refreshAllData = useCallback(async () => {
    console.log("刷新所有用户相关数据...");
    try {
      await Promise.all([
        fetchDepartments(),
        fetchRoles(),
        fetchUsers()
      ]);
      console.log("所有用户相关数据加载完成！");
    } catch (error) {
      console.error("加载数据过程中发生错误:", error);
    }
  }, [fetchDepartments, fetchRoles, fetchUsers]);

  // 初始加载
  useEffect(() => {
    // 顺序加载数据
    console.log("开始加载所有用户相关数据...");
    refreshAllData();
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
