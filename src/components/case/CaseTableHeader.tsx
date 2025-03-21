
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
  resultTime: '结案时间',
  actions: '操作'
};

interface CaseTableHeaderProps {
  visibleColumns?: string[];
}

export const CaseTableHeader = ({ visibleColumns = [] }: CaseTableHeaderProps) => {
  // 如果没有指定可见列，则默认显示所有列（除了操作列，操作列单独处理）
  const columnsToShow = visibleColumns.length > 0 
    ? visibleColumns.filter(col => col !== 'actions')
    : Object.keys(columnTitles).filter(col => col !== 'actions');

  return (
    <TableHeader>
      <TableRow>
        {columnsToShow.map(column => (
          <TableHead 
            key={column} 
            className="whitespace-normal text-xs"
          >
            {columnTitles[column]}
          </TableHead>
        ))}
        {/* 添加固定在右侧的操作列 */}
        <TableHead 
          className="!sticky !right-0 !bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] whitespace-normal text-xs"
        >
          {columnTitles.actions}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
