import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { exportSmsRecordsToExcel } from '@/utils/exportUtils';
import type { SmsRecord } from '@/types/sms';
import { useToast } from '@/hooks/use-toast';

interface SmsRecordsTableProps {
  data: SmsRecord[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SmsRecordsTable = ({ 
  data, 
  isLoading, 
  currentPage, 
  totalPages,
  onPageChange,
}: SmsRecordsTableProps) => {
  const { toast } = useToast();
  
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

  const handleExport = () => {
    try {
      exportSmsRecordsToExcel(data);
      toast({
        title: "导出成功",
        description: "Excel文件已开始下载",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "导出失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>导出Excel</Button>
        </div>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>流水ID</TableHead>
              <TableHead>批次号</TableHead>
              <TableHead>客户姓名/手机</TableHead>
              <TableHead>短信类型</TableHead>
              <TableHead>短信内容</TableHead>
              <TableHead>发送数量</TableHead>
              <TableHead>发送时间</TableHead>
              <TableHead>接收时间</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>发送人</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.send_code}</TableCell>
                  <TableCell>{record.recipients.join(', ')}</TableCell>
                  <TableCell>{record.sms_type}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{record.content}</TableCell>
                  <TableCell>
                    成功：{record.success_count || 0}
                    <br />
                    失败：{record.fail_count || 0}
                  </TableCell>
                  <TableCell>{formatDate(record.send_time)}</TableCell>
                  <TableCell>{record.status === 'success' ? formatDate(record.send_time) : '-'}</TableCell>
                  <TableCell>{formatDate(record.created_at)}</TableCell>
                  <TableCell>{record.created_by || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};