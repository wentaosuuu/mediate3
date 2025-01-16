import React from 'react';
import { TableBody } from '@/components/ui/table';
import { SmsTableRow } from './TableRow';
import type { SmsRecord } from '@/types/sms';

interface SmsTableBodyProps {
  isLoading: boolean;
  data: SmsRecord[];
  onDelete: (id: string) => void;
}

export const SmsTableBody = ({ isLoading, data, onDelete }: SmsTableBodyProps) => {
  if (isLoading) {
    return (
      <TableBody>
        <tr>
          <td colSpan={11} className="text-center py-8">
            加载中...
          </td>
        </tr>
      </TableBody>
    );
  }

  if (data.length === 0) {
    return (
      <TableBody>
        <tr>
          <td colSpan={11} className="text-center py-8 text-gray-500">
            暂无数据
          </td>
        </tr>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((record) => (
        <SmsTableRow 
          key={record.id} 
          record={record}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  );
};