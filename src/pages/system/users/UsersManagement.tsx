
import React from 'react';
import UserHeader from './components/UserHeader';
import UserSearch from './components/UserSearch';
import UsersTable from './components/UsersTable';
import UserFormDialog from './components/UserFormDialog';
import { useUserData } from './hooks/useUserData';
import { useUserOperations } from './hooks/useUserOperations';
import { useUserSearch } from './hooks/useUserSearch';

const UsersManagement = () => {
  // 使用自定义钩子获取用户数据
  const { 
    users, 
    departments, 
    roles, 
    isLoading: dataLoading, 
    fetchUsers,
    fetchDepartments,
    fetchRoles
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
  } = useUserOperations(fetchUsers);

  // 使用自定义钩子处理用户搜索
  const { searchQuery, setSearchQuery, filteredUsers } = useUserSearch(users);

  // 合并加载状态
  const isLoading = dataLoading || operationLoading;

  // 刷新所有数据
  const refreshAllData = async () => {
    console.log("刷新所有用户相关数据...");
    await fetchDepartments();
    await fetchRoles();
    await fetchUsers();
  };

  return (
    <div className="p-6">
      {/* 用户管理头部 */}
      <UserHeader onCreateUser={openCreateDialog} />

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
    </div>
  );
};

export default UsersManagement;
