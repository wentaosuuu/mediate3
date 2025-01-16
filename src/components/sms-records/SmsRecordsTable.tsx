import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { exportSmsRecordsToExcel } from '@/utils/exportUtils';
import type { SmsRecord } from '@/types/sms';
import { SmsTableHeader } from './table/TableHeader';
import { SmsTableRow } from './table/TableRow';
import { TablePagination } from './table/TablePagination';

interface SmsRecordsTableProps {
  data: SmsRecord[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  refetch: () => void;
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
      
      {/* 使用相对定位包装器来实现固定列 */}
      <div className="relative">
        {/* 可滚动区域 */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <SmsTableHeader />
                <TableBody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8">
                        加载中...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8 text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    data.map((record) => (
                      <SmsTableRow 
                        key={record.id} 
                        record={record}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};