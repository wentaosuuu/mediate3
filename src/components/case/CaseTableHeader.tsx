import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const CaseTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[120px]">案件编号</TableHead>
        <TableHead className="w-[120px]">批次编号</TableHead>
        <TableHead className="w-[120px]">借据编号</TableHead>
        <TableHead className="w-[120px]">身份证号</TableHead>
        <TableHead className="w-[100px]">客户姓名</TableHead>
        <TableHead className="w-[120px]">手机号</TableHead>
        <TableHead className="w-[100px]">产品线</TableHead>
        <TableHead className="w-[100px]">受托方</TableHead>
        <TableHead className="w-[100px]">调解员</TableHead>
        <TableHead className="w-[100px]">分案员</TableHead>
        <TableHead className="w-[100px]">跟进状态</TableHead>
        <TableHead className="w-[150px]">最新跟进时间</TableHead>
        <TableHead className="w-[150px]">最新编辑时间</TableHead>
        <TableHead className="w-[150px]">案件入库时间</TableHead>
        <TableHead className="w-[150px]">分案时间</TableHead>
        <TableHead className="w-[150px]">结案时间</TableHead>
        <TableHead className="w-[120px]">操作</TableHead>
      </TableRow>
    </TableHeader>
  );
};