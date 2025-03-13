
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface DepartmentsTableProps {
  departments: any[];
  isLoading: boolean;
  onEdit: (department: any) => void;
  onDelete: (departmentId: string) => void;
}

const DepartmentsTable = ({ departments, isLoading, onEdit, onDelete }: DepartmentsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                加载中...
              </TableCell>
            </TableRow>
          ) : departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                没有找到部门
              </TableCell>
            </TableRow>
          ) : (
            departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description || '-'}</TableCell>
                <TableCell>{new Date(department.created_at).toLocaleString()}</TableCell>
                <TableCell>{department.updated_at ? new Date(department.updated_at).toLocaleString() : '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(department)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(department.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentsTable;
