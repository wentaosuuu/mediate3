
import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import RoleTableRow from './RoleTableRow';

interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface RoleTableBodyProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onDataPermission: (role: Role) => void;
}

/**
 * 角色表格主体组件
 * 用于展示角色列表或加载/空状态
 */
const RoleTableBody = ({ roles, isLoading, onEdit, onDelete, onDataPermission }: RoleTableBodyProps) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            加载中...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  if (roles.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            没有找到角色
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  return (
    <TableBody>
      {roles.map((role) => (
        <RoleTableRow 
          key={role.id}
          role={role} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onDataPermission={onDataPermission}
        />
      ))}
    </TableBody>
  );
};

export default RoleTableBody;
