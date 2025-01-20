import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { supabase } from '@/integrations/supabase/client';

const Balance = () => {
  // 获取钱包余额
  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
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

  // 获取最近交易记录
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          created_by (
            username
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <WalletBalance 
        balance={wallet?.balance || 0} 
        isLoading={isLoadingWallet} 
      />
      <TransactionHistory 
        transactions={transactions || []} 
        isLoading={isLoadingTransactions} 
      />
    </div>
  );
};

export default Balance;