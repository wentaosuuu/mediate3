
import React from 'react';
import { Table } from '@/components/ui/table';
import RoleTableHeader from './table/RoleTableHeader';
import RoleTableBody from './table/RoleTableBody';

interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface RolesTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onDataPermission: (role: Role) => void;
}

/**
 * 角色表格组件
 * 组合表头和表体，展示完整的角色列表
 */
const RolesTable = ({ roles, isLoading, onEdit, onDelete, onDataPermission }: RolesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <RoleTableHeader />
        <RoleTableBody 
          roles={roles} 
          isLoading={isLoading} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onDataPermission={onDataPermission}
        />
      </Table>
    </div>
  );
};

export default RolesTable;
