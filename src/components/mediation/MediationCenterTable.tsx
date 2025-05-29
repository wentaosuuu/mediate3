
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Case } from '@/types/case';

interface MediationCenterTableProps {
  data: Case[];
  isLoading: boolean;
  selectedCases: Record<string, boolean>;
  onSelectCase: (caseId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onCaseDetail: (caseData: Case) => void;
  onCaseEdit: (caseData: Case) => void;
}

export const MediationCenterTable = ({ 
  data, 
  isLoading,
  selectedCases,
  onSelectCase,
  onSelectAll,
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

  const isAllSelected = data.length > 0 && data.every(caseItem => selectedCases[caseItem.id]);
  const isIndeterminate = data.some(caseItem => selectedCases[caseItem.id]) && !isAllSelected;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
                aria-label="全选"
              />
            </TableHead>
            <TableHead>案件编号</TableHead>
            <TableHead>批次编号</TableHead>
            <TableHead>借据编号</TableHead>
            <TableHead>身份证号</TableHead>
            <TableHead>客户姓名</TableHead>
            <TableHead>手机号</TableHead>
            <TableHead>产品线</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCases[caseItem.id] || false}
                  onCheckedChange={(checked) => onSelectCase(caseItem.id, checked === true)}
                  aria-label={`选择案件 ${caseItem.case_number}`}
                />
              </TableCell>
              <TableCell className="font-medium">{caseItem.case_number}</TableCell>
              <TableCell>{caseItem.batch_number}</TableCell>
              <TableCell>{caseItem.borrower_number}</TableCell>
              <TableCell>{caseItem.id_number}</TableCell>
              <TableCell>{caseItem.customer_name}</TableCell>
              <TableCell>{caseItem.phone || '-'}</TableCell>
              <TableCell>{caseItem.product_line || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
