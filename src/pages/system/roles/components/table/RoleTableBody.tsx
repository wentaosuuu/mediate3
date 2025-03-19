
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
  // 加载状态显示
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
              <span>加载中...</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // 空数据状态显示
  if (!roles || roles.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-lg font-medium">没有找到角色</span>
              <span className="text-sm mt-1">请点击"创建角色"按钮添加新角色</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // 正常数据显示
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
