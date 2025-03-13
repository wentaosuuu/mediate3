
import { useState, useEffect } from 'react';
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
    isLoading: isLoading || loadingState,
    fetchUsers,
    setIsLoading
  };
};
