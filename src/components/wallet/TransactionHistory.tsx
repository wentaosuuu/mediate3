import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  service_type: string;
  description: string;
  created_at: string;
  created_by: {
    username: string;
  } | null;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionHistory = ({ transactions, isLoading }: TransactionHistoryProps) => {
  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(Math.abs(amount));
    
    return type === 'RECHARGE' ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'RECHARGE':
        return { label: '充值', variant: 'default' as const };
      case 'CONSUME':
        return { label: '消费', variant: 'destructive' as const };
      default:
        return { label: '未知', variant: 'secondary' as const };
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">最近交易记录</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">最近交易记录</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>时间</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>服务</TableHead>
            <TableHead>金额</TableHead>
            <TableHead>说明</TableHead>
            <TableHead>操作人</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const { label, variant } = getTypeLabel(transaction.type);
            return (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={variant}>{label}</Badge>
                </TableCell>
                <TableCell>{transaction.service_type}</TableCell>
                <TableCell className={
                  transaction.type === 'RECHARGE' ? 'text-green-600' : 'text-red-600'
                }>
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.created_by?.username || '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};