
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

// 定义列信息和标题的映射
const columnTitles: Record<string, string> = {
  caseNumber: '案件编号',
  batchNumber: '批次编号',
  borrowerNumber: '借据编号',
  idNumber: '身份证号',
  customerName: '客户姓名',
  phone: '手机号',
  productLine: '产品线',
  receiver: '受托方',
  adjuster: '调解员',
  distributor: '分案员',
  progressStatus: '跟进状态',
  latestProgressTime: '最新跟进时间',
  latestEditTime: '最新编辑时间',
  caseEntryTime: '案件入库时间',
  distributionTime: '分案时间',
  resultTime: '结案时间'
};

interface CaseTableHeaderProps {
  visibleColumns?: string[];
}

export const CaseTableHeader = ({ visibleColumns = [] }: CaseTableHeaderProps) => {
  // 如果没有指定可见列，则默认显示所有列
  const columnsToShow = visibleColumns.length > 0 
    ? visibleColumns 
    : Object.keys(columnTitles);

  return (
    <TableHeader>
      <TableRow>
        {columnsToShow.map(column => (
          <TableHead 
            key={column} 
            className="whitespace-nowrap min-w-[120px]"
          >
            {columnTitles[column]}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
