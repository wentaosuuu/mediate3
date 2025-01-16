import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const SmsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-nowrap">流水ID</TableHead>
        <TableHead className="whitespace-nowrap">批次号</TableHead>
        <TableHead className="whitespace-nowrap">客户姓名/手机</TableHead>
        <TableHead className="whitespace-nowrap">短信类型</TableHead>
        <TableHead className="whitespace-nowrap">短信内容</TableHead>
        <TableHead className="whitespace-nowrap">发送数量</TableHead>
        <TableHead className="whitespace-nowrap">发送状态</TableHead>
        <TableHead className="whitespace-nowrap">发送时间/接收时间</TableHead>
        <TableHead className="whitespace-nowrap">创建时间</TableHead>
        <TableHead className="whitespace-nowrap">发送人</TableHead>
        {/* 固定操作列 */}
        <TableHead className="whitespace-nowrap sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
          操作
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};