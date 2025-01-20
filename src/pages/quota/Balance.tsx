import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const Balance = () => {
  // 获取钱包余额
  const { data: wallet, isLoading: isWalletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  // 获取最近的交易记录
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // 格式化金额显示
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  // 格式化日期显示
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isWalletLoading || isTransactionsLoading) {
    return <div className="flex justify-center items-center h-full">加载中...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 余额卡片 */}
      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-500">当前余额</h3>
          <p className="text-3xl font-bold text-primary">
            {wallet ? formatAmount(wallet.balance) : '¥0.00'}
          </p>
        </div>
      </Card>

      {/* 交易记录 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">最近交易记录</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>时间</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>服务</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>说明</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    transaction.type === 'RECHARGE' 
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}>
                    {transaction.type === 'RECHARGE' ? '充值' : '消费'}
                  </span>
                </TableCell>
                <TableCell>{transaction.service_type}</TableCell>
                <TableCell className={cn(
                  "font-medium",
                  transaction.type === 'RECHARGE' ? "text-green-600" : "text-red-600"
                )}>
                  {transaction.type === 'RECHARGE' ? '+' : '-'}
                  {formatAmount(transaction.amount)}
                </TableCell>
                <TableCell className="text-gray-500">
                  {transaction.description || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Balance;