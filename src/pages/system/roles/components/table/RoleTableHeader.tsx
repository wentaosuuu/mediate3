
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

/**
 * 角色表格头部组件
 * 用于显示角色表格的列标题
 */
const RoleTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>角色名称</TableHead>
        <TableHead>描述</TableHead>
        <TableHead>创建时间</TableHead>
        <TableHead>更新时间</TableHead>
        <TableHead className="text-right">操作</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RoleTableHeader;
