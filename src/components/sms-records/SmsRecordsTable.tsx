import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export const SmsRecordsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button variant="outline">导出Excel</Button>
        </div>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>流水ID</TableHead>
              <TableHead>批次号</TableHead>
              <TableHead>客户姓名/手机</TableHead>
              <TableHead>短信类型</TableHead>
              <TableHead>短信内容</TableHead>
              <TableHead>发送数量</TableHead>
              <TableHead>发送时间</TableHead>
              <TableHead>接收时间</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>发送人</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                暂无数据
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};