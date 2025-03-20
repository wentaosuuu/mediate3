
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { supabase } from '@/integrations/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo';

const Balance = () => {
  const navigate = useNavigate();
  const { userInfo, handleLogout } = useUserInfo();

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/');
    }
  };

  // 获取钱包余额
  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      console.log('Fetching wallet data...'); // 添加日志
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching wallet:', error); // 添加错误日志
        throw error;
      }
      console.log('Wallet data:', data); // 添加日志
      return data;
    }
  });

  // 获取最近交易记录
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      console.log('Fetching transactions...'); // 添加日志
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
      
      if (error) {
        console.error('Error fetching transactions:', error); // 添加错误日志
        throw error;
      }
      console.log('Transactions data:', data); // 添加日志
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/wallet/balance"
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={userInfo.username}
          department={userInfo.department}
          role={userInfo.role}
          onLogout={onLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={userInfo.username} currentPath="/wallet/balance">
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
        </MainContent>
      </div>
    </div>
  );
};

export default Balance;
