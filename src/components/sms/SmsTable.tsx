import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export const SmsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button variant="outline">+ 新增</Button>
          <Button variant="outline">导出Excel</Button>
        </div>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>序号</TableHead>
              <TableHead>发送编码</TableHead>
              <TableHead>短信模板</TableHead>
              <TableHead>短信类型</TableHead>
              <TableHead>发送对象</TableHead>
              <TableHead>发送时间</TableHead>
              <TableHead>发送成功（人）</TableHead>
              <TableHead>发送失败（人）</TableHead>
              <TableHead>超频失败（人）</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>创建人</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                暂无数据
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};