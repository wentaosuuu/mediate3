
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
import { Badge } from '@/components/ui/badge';
import { Case } from '@/types/case';
import { format } from 'date-fns';

interface MediationCenterTableProps {
  data: Case[];
  isLoading: boolean;
  onCaseDetail: (caseData: Case) => void;
  onCaseEdit: (caseData: Case) => void;
}

export const MediationCenterTable = ({ 
  data, 
  isLoading, 
  onCaseDetail, 
  onCaseEdit 
}: MediationCenterTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">暂无已分配的案件</p>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="overflow-auto">
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
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell className="font-medium">{caseItem.case_number}</TableCell>
              <TableCell>{caseItem.batch_number}</TableCell>
              <TableCell>{caseItem.borrower_number}</TableCell>
              <TableCell>{caseItem.id_number}</TableCell>
              <TableCell>{caseItem.customer_name}</TableCell>
              <TableCell>{caseItem.phone || '-'}</TableCell>
              <TableCell>{caseItem.product_line || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                    onClick={() => onCaseDetail(caseItem)}
                  >
                    详情
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                    onClick={() => onCaseEdit(caseItem)}
                  >
                    外呼
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    调解
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-orange-600 hover:text-orange-800 p-0 h-auto"
                  >
                    信修外呼
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    案件公示
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-green-600 hover:text-green-800 p-0 h-auto"
                  >
                    还款外呼
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
