import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
      <div className="relative overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">案件编号</TableHead>
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
                  <TableHead className="sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={17} className="text-center py-4">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={17} className="text-center py-4 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="whitespace-nowrap">{caseItem.case_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.batch_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.borrower_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.id_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.customer_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.phone || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.product_line || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.receiver || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.adjuster || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.distributor || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{caseItem.progress_status || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(caseItem.latest_progress_time)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(caseItem.latest_edit_time)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(caseItem.case_entry_time)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(caseItem.distribution_time)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(caseItem.result_time)}</TableCell>
                      <TableCell className="sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            编辑
                          </Button>
                          <Button size="sm" variant="outline">
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};