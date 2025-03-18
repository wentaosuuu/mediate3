
import React, { useEffect } from 'react';
import UserHeader from './UserHeader';
import UserSearch from './UserSearch';
import UsersTable from './UsersTable';
import UserFormDialog from './UserFormDialog';
import { useUserData } from '../hooks/useUserData';
import { useUserOperations } from '../hooks/useUserOperations';
import { useUserSearch } from '../hooks/useUserSearch';

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
    refreshAllData,
    fetchUsers
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

  // 首次加载数据
  useEffect(() => {
    console.log("UsersContainer组件挂载，初始化数据");
    refreshAllData();
  }, [refreshAllData]);

  return (
    <>
      {/* 用户搜索组件 */}
      <UserSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* 用户表格组件 */}
      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        onEditUser={openEditDialog}
        onToggleStatus={toggleUserStatus}
        onDeleteUser={deleteUser}
      />

      {/* 用户表单对话框 */}
      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        currentUser={currentUser}
        isLoading={isLoading}
        departments={departments}
        roles={roles}
        onRefreshData={refreshAllData}
      />
    </>
  );
};

export default UsersContainer;
