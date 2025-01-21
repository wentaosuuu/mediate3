import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OrdersTable } from '@/components/wallet/OrdersTable';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  
  // 获取当前用户信息
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUsername(user?.email?.split('@')[0] || null);
    };
    
    fetchUser();
  }, []);

  // Mock user data - 后续需要替换为实际用户数据
  const mockUser = {
    username: username || '用户',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };
  
  // 获取订单数据
  const { data: orders, isLoading } = useQuery({
    queryKey: ['recharge-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recharge_orders')
        .select(`
          *,
          recharge_order_items (
            service_type,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={location.pathname}
          onMenuClick={handleMenuClick}
        />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar
            username={mockUser.username}
            department={mockUser.department}
            role={mockUser.role}
            onLogout={handleLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </div>
        <div className="mt-16">
          <MainContent
            username={username}
            currentPath={location.pathname}
          >
            <div className="container mx-auto py-4">
              <h1 className="text-2xl font-bold mb-6">充值订单管理</h1>
              <OrdersTable data={orders || []} isLoading={isLoading} />
            </div>
          </MainContent>
        </div>
      </div>
    </div>
  );
};

export default Orders;