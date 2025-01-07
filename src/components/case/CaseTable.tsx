import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const CaseTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>案件编号</TableHead>
            <TableHead>批次编号</TableHead>
            <TableHead>借据编号</TableHead>
            <TableHead>身份证号</TableHead>
            <TableHead>客户姓名</TableHead>
            <TableHead>手机号</TableHead>
            <TableHead>产品线</TableHead>
            <TableHead>受托方</TableHead>
            <TableHead>调解员</TableHead>
            <TableHead>分案员</TableHead>
            <TableHead>跟进状态</TableHead>
            <TableHead>最新跟进时间</TableHead>
            <TableHead>最新编辑时间</TableHead>
            <TableHead>案件入库时间</TableHead>
            <TableHead>分案时间</TableHead>
            <TableHead>结案时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-gray-500">暂无数据</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};