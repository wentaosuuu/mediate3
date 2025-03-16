
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, UserCheck, UserX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  users: any[];
  isLoading: boolean;
  onEditUser: (user: any) => void;
  onToggleStatus: (user: any) => Promise<void>;
  onDeleteUser: (user: any) => Promise<void>;
}

const UsersTable = ({ 
  users, 
  isLoading, 
  onEditUser, 
  onToggleStatus, 
  onDeleteUser 
}: UsersTableProps) => {
  // 如果正在加载，显示加载中状态
  if (isLoading) {
    return (
      <div className="mt-4 p-8 flex justify-center items-center border rounded-lg bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">加载用户列表中...</p>
        </div>
      </div>
    );
  }

  // 如果没有用户，显示空状态
  if (users.length === 0) {
    return (
      <div className="mt-4 p-8 flex justify-center items-center border rounded-lg bg-white">
        <div className="text-center">
          <p className="text-gray-500">暂无用户数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户名</TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>电话</TableHead>
            <TableHead>部门</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>注册时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name || '-'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || '-'}</TableCell>
              <TableCell>
                {user.department_name ? (
                  <Badge variant="outline">{user.department_name}</Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {user.role_name ? (
                  <Badge variant="outline">{user.role_name}</Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditUser(user)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
