import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Consumption = () => {
  // 获取钱包交易记录
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">账户消费总表</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>交易时间</TableHead>
            <TableHead>服务类型</TableHead>
            <TableHead>交易类型</TableHead>
            <TableHead>金额</TableHead>
            <TableHead>说明</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{transaction.service_type}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>
                {transaction.type === 'DEBIT' ? '-' : '+'}
                {transaction.amount}
              </TableCell>
              <TableCell>{transaction.description || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Consumption;