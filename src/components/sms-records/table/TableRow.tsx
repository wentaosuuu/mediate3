import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import type { SmsRecord } from '@/types/sms';

interface SmsTableRowProps {
  record: SmsRecord;
  onDelete: (id: string) => void;
}

export const SmsTableRow = ({ record, onDelete }: SmsTableRowProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

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

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">{record.id}</TableCell>
      <TableCell className="whitespace-nowrap">{record.send_code}</TableCell>
      <TableCell className="whitespace-nowrap">{record.recipients.join(', ')}</TableCell>
      <TableCell className="whitespace-nowrap">{record.sms_type}</TableCell>
      <TableCell className="max-w-[300px] truncate">{record.content}</TableCell>
      <TableCell className="whitespace-nowrap">
        成功：{record.success_count || 0}
        <br />
        失败：{record.fail_count || 0}
      </TableCell>
      <TableCell className="whitespace-nowrap">
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
      <TableCell className="whitespace-nowrap">
        {formatDate(record.send_time)}
        <br />
        {record.delivery_time ? formatDate(record.delivery_time) : '-'}
      </TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(record.created_at)}</TableCell>
      <TableCell className="whitespace-nowrap">{record.created_by || '-'}</TableCell>
      {/* 固定操作列单元格 */}
      <TableCell className="!sticky !right-0 !bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(record.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};