import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { exportSmsRecordsToExcel } from '@/utils/exportUtils';
import type { SmsRecord } from '@/types/sms';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SmsRecordsTableProps {
  data: SmsRecord[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  refetch: () => void; // 添加refetch属性用于刷新数据
}

export const SmsRecordsTable = ({ 
  data, 
  isLoading, 
  currentPage, 
  totalPages,
  onPageChange,
  refetch,
}: SmsRecordsTableProps) => {
  const { toast } = useToast();
  
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

  // 获取状态标签的样式
  const getStatusBadgeStyle = (status: string | null) => {
    switch (status) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
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

  // 处理删除记录
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sms_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "删除成功",
        description: "短信记录已删除",
      });
      
      // 刷新数据
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "删除失败",
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
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>流水ID</TableHead>
              <TableHead>批次号</TableHead>
              <TableHead>客户姓名/手机</TableHead>
              <TableHead>短信类型</TableHead>
              <TableHead>短信内容</TableHead>
              <TableHead>发送数量</TableHead>
              <TableHead>发送状态</TableHead>
              <TableHead className="whitespace-normal">
                发送时间
                <br />
                接收时间
              </TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>发送人</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
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
                  <TableCell>
                    <Badge className={getStatusBadgeStyle(record.status)}>
                      {record.status === 'success' ? '发送成功' :
                       record.status === 'failed' ? '发送失败' :
                       record.status === 'pending' ? '发送中' : '未知状态'}
                    </Badge>
                    {record.delivery_message && (
                      <div className="text-xs text-gray-500 mt-1">
                        {record.delivery_message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {formatDate(record.send_time)}
                    <br />
                    {record.delivery_time ? formatDate(record.delivery_time) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(record.created_at)}</TableCell>
                  <TableCell>{record.created_by || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
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