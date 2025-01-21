import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { supabase } from '@/integrations/supabase/client';

const Balance = () => {
  const navigate = useNavigate();

  // Mock user data - 实际项目中应该从认证系统获取
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

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

  const handleLogout = () => {
    navigate('/');
  };

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
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={mockUser.username} currentPath="/wallet/balance">
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