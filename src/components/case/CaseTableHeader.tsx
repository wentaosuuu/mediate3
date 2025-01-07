import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const CaseTableHeader = () => {
  return (
    <TableHeader className="bg-white">
      <TableRow>
        <TableHead className="whitespace-nowrap bg-white sticky left-0 z-20">案件编号</TableHead>
        <TableHead className="whitespace-nowrap">批次编号</TableHead>
        <TableHead className="whitespace-nowrap">借据编号</TableHead>
        <TableHead className="whitespace-nowrap">身份证号</TableHead>
        <TableHead className="whitespace-nowrap">客户姓名</TableHead>
        <TableHead className="whitespace-nowrap">手机号</TableHead>
        <TableHead className="whitespace-nowrap">产品线</TableHead>
        <TableHead className="whitespace-nowrap">受托方</TableHead>
        <TableHead className="whitespace-nowrap">调解员</TableHead>
        <TableHead className="whitespace-nowrap">分案员</TableHead>
        <TableHead className="whitespace-nowrap">跟进状态</TableHead>
        <TableHead className="whitespace-nowrap">最新跟进时间</TableHead>
        <TableHead className="whitespace-nowrap">最新编辑时间</TableHead>
        <TableHead className="whitespace-nowrap">案件入库时间</TableHead>
        <TableHead className="whitespace-nowrap">分案时间</TableHead>
        <TableHead className="whitespace-nowrap">结案时间</TableHead>
        <TableHead className="sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-20">
          操作
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};