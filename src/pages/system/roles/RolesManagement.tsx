
import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RolesSearch from './components/RolesSearch';
import RolesTable from './components/RolesTable';
import RoleFormDialog from './components/RoleFormDialog';
import DataPermissionDialog from './components/DataPermissionDialog';
import { useRoleData } from './hooks/useRoleData';
import { useRoleDialog } from './hooks/useRoleDialog';
import { useRoleOperations } from './hooks/useRoleOperations';
import { useRoleSearch } from './hooks/useRoleSearch';

/**
 * 角色管理组件
 * 整合角色管理的各个功能模块
 */
const RolesManagement = () => {
  // 使用钩子获取数据和状态管理
  const { 
    roles, 
    permissions, 
    isLoading: dataLoading, 
    fetchRoles, 
    fetchRolePermissions 
  } = useRoleData();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    currentRole,
    isDataPermissionDialogOpen,
    setIsDataPermissionDialogOpen,
    dataPermissionRole,
    openCreateDialog,
    openEditDialog,
    openDataPermissionDialog
  } = useRoleDialog();
  
  const {
    isLoading: operationsLoading,
    deleteRole,
    handleRoleSubmit,
    handleSaveDataPermission
  } = useRoleOperations(fetchRoles);
  
  const { searchQuery, setSearchQuery, filteredRoles } = useRoleSearch(roles);
  
  // 合并加载状态
  const isLoading = dataLoading || operationsLoading;

  // 角色表单提交处理
  const onRoleSubmit = async (values: any, rolePermissions: string[]) => {
    await handleRoleSubmit(values, rolePermissions, currentRole);
  };

  // 用于调试
  useEffect(() => {
    console.log('当前角色列表数据:', roles);
    console.log('过滤后的角色列表:', filteredRoles);
  }, [roles, filteredRoles]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          创建角色
        </Button>
      </div>

      <RolesSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <RolesTable 
        roles={filteredRoles} 
        isLoading={isLoading} 
        onEdit={openEditDialog} 
        onDelete={deleteRole}
        onDataPermission={openDataPermissionDialog}
      />

      <RoleFormDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        currentRole={currentRole} 
        permissions={permissions}
        fetchRolePermissions={fetchRolePermissions}
        onSubmit={onRoleSubmit}
        isLoading={isLoading}
      />
      
      <DataPermissionDialog
        isOpen={isDataPermissionDialogOpen}
        setIsOpen={setIsDataPermissionDialogOpen}
        role={dataPermissionRole}
        onSave={handleSaveDataPermission}
      />
    </div>
  );
};

export default RolesManagement;
