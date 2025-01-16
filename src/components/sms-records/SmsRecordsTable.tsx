import React from 'react';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { SmsRecord } from '@/types/sms';
import { SmsTableHeader } from './table/TableHeader';
import { SmsTableBody } from './table/TableBody';
import { TablePagination } from './table/TablePagination';
import { useExportSms } from './hooks/useExportSms';
import { useDeleteSms } from './hooks/useDeleteSms';

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
  const { handleExport } = useExportSms();
  const { handleDelete } = useDeleteSms(refetch);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExport(data)}
          >
            导出Excel
          </Button>
        </div>
      </div>
      
      <div className="relative overflow-x-auto">
        <Table>
          <SmsTableHeader />
          <SmsTableBody 
            isLoading={isLoading}
            data={data}
            onDelete={handleDelete}
          />
        </Table>
      </div>

      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};