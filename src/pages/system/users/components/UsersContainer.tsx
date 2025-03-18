
import React, { useEffect, useRef } from 'react';
import UserSearch from './UserSearch';
import UsersTable from './UsersTable';
import UserFormDialog from './UserFormDialog';
import { useUserData } from '../hooks/useUserData';
import { useUserOperations } from '../hooks/useUserOperations';
import { useUserSearch } from '../hooks/useUserSearch';
import { toast } from "sonner";

/**
 * 用户管理容器组件
 * 整合用户数据、搜索和操作功能
 */
const UsersContainer = () => {
  // 使用自定义钩子获取用户数据
  const { 
    users, 
    departments, 
    roles, 
    isLoading: dataLoading, 
    refreshAllData
  } = useUserData();

  // 使用自定义钩子处理用户操作
  const {
    currentUser,
    isDialogOpen,
    isLoading: operationLoading,
    setIsDialogOpen,
    handleSubmit,
    openCreateDialog,
    openEditDialog,
    toggleUserStatus,
    deleteUser
  } = useUserOperations(refreshAllData);

  // 使用自定义钩子处理用户搜索
  const { searchQuery, setSearchQuery, filteredUsers } = useUserSearch(users);

  // 合并加载状态
  const isLoading = dataLoading || operationLoading;
  
  // 防止无限刷新的标记
  const isRefreshing = useRef(false);

  // 对话框打开状态变化时的处理
  const handleDialogOpenChange = (open: boolean) => {
    console.log("对话框状态变化:", open);
    setIsDialogOpen(open);
    
    // 关闭对话框后，刷新一次数据
    if (!open && !isRefreshing.current) {
      console.log("对话框关闭，刷新用户数据");
      isRefreshing.current = true;
      
      const toastId = `refresh-${Date.now()}`;
      toast.loading("正在刷新用户数据...", { id: toastId });
      
      refreshAllData().then(() => {
        console.log("对话框关闭后数据刷新完成");
        toast.success("用户数据已更新", { id: toastId });
        isRefreshing.current = false;
      }).catch(error => {
        console.error("对话框关闭后数据刷新失败:", error);
        toast.error(`数据刷新失败: ${(error as Error).message}`, { id: toastId });
        isRefreshing.current = false;
      });
    }
  };

  // 确保页面加载时获取最新数据
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isRefreshing.current) {
        console.log("初始加载用户数据");
        isRefreshing.current = true;
        
        const toastId = `initial-load-${Date.now()}`;
        toast.loading("加载用户数据...", { id: toastId });
        
        try {
          await refreshAllData();
          console.log("初始用户数据加载完成");
          toast.success("用户数据加载完成", { id: toastId });
        } catch (error) {
          console.error("初始用户数据加载失败:", error);
          toast.error(`数据加载失败: ${(error as Error).message}`, { id: toastId });
        } finally {
          isRefreshing.current = false;
        }
      }
    };
    
    loadInitialData();
  }, [refreshAllData]);

  return (
    <>
      <UserSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        onEditUser={openEditDialog}
        onToggleStatus={toggleUserStatus}
        onDeleteUser={deleteUser}
      />

      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        currentUser={currentUser}
        isLoading={isLoading}
        departments={departments}
        roles={roles}
      />
    </>
  );
};

export default UsersContainer;
