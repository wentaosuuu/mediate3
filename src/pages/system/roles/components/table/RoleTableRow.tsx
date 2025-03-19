
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Key } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface RoleTableRowProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onDataPermission: (role: Role) => void;
}

/**
 * 角色表格行组件
 * 用于显示单个角色的信息和操作按钮
 */
const RoleTableRow = ({ role, onEdit, onDelete, onDataPermission }: RoleTableRowProps) => {
  return (
    <TableRow key={role.id}>
      <TableCell>{role.name}</TableCell>
      <TableCell>{role.description || '-'}</TableCell>
      <TableCell>{new Date(role.created_at).toLocaleString()}</TableCell>
      <TableCell>{role.updated_at ? new Date(role.updated_at).toLocaleString() : '-'}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={() => onDataPermission(role)} title="数据权限">
          <Key className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(role)} title="编辑">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(role.id)} title="删除">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default RoleTableRow;
