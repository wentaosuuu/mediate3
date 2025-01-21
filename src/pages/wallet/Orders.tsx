import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrdersTable } from '@/components/wallet/OrdersTable';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { toast } from "sonner";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  
  // 获取当前用户信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('获取用户信息失败:', error.message);
          toast.error('获取用户信息失败');
          return;
        }
        setUsername(user?.email?.split('@')[0] || '未知用户');
      } catch (err) {
        console.error('获取用户信息出错:', err);
        toast.error('获取用户信息失败');
      }
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

  // 获取订单数据
  const { data: orders, isLoading, error: ordersError } = useQuery({
    queryKey: ['recharge-orders'],
    queryFn: async () => {
      try {
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

        if (error) {
          console.error('获取订单数据失败:', error.message);
          throw error;
        }
        return data;
      } catch (err) {
        console.error('查询订单数据出错:', err);
        throw err;
      }
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('订单数据查询失败:', error);
        toast.error('获取订单数据失败，请稍后重试');
      }
    }
  });

  // 如果查询出错，显示错误提示
  if (ordersError) {
    toast.error('加载订单数据失败');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={location.pathname}
          onMenuClick={(path) => navigate(path)}
        />
      </div>
      <div className="pl-64 min-h-screen">
        <TopBar
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <MainContent username={username} currentPath={location.pathname}>
          <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold mb-6">充值订单管理</h1>
            <OrdersTable data={orders || []} isLoading={isLoading} />
          </div>
        </MainContent>
      </div>
    </div>
  );
};

export default Orders;