import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface Case {
  id: string;
  case_number: string;
  batch_number: string;
  borrower_number: string;
  id_number: string;
  customer_name: string;
  phone: string | null;
  product_line: string | null;
  receiver: string | null;
  adjuster: string | null;
  distributor: string | null;
  progress_status: string | null;
  latest_progress_time: string | null;
  latest_edit_time: string | null;
  case_entry_time: string | null;
  distribution_time: string | null;
  result_time: string | null;
}

interface CaseTableProps {
  data: Case[];
  isLoading: boolean;
}

export const CaseTable = ({ data, isLoading }: CaseTableProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={16} className="text-center py-4">
                加载中...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={16} className="text-center py-4 text-gray-500">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            data.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell>{caseItem.case_number}</TableCell>
                <TableCell>{caseItem.batch_number}</TableCell>
                <TableCell>{caseItem.borrower_number}</TableCell>
                <TableCell>{caseItem.id_number}</TableCell>
                <TableCell>{caseItem.customer_name}</TableCell>
                <TableCell>{caseItem.phone || '-'}</TableCell>
                <TableCell>{caseItem.product_line || '-'}</TableCell>
                <TableCell>{caseItem.receiver || '-'}</TableCell>
                <TableCell>{caseItem.adjuster || '-'}</TableCell>
                <TableCell>{caseItem.distributor || '-'}</TableCell>
                <TableCell>{caseItem.progress_status || '-'}</TableCell>
                <TableCell>{formatDate(caseItem.latest_progress_time)}</TableCell>
                <TableCell>{formatDate(caseItem.latest_edit_time)}</TableCell>
                <TableCell>{formatDate(caseItem.case_entry_time)}</TableCell>
                <TableCell>{formatDate(caseItem.distribution_time)}</TableCell>
                <TableCell>{formatDate(caseItem.result_time)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};