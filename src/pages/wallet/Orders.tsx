import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { OrdersTable } from '@/components/wallet/OrdersTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock user data - 实际项目中应该从认证系统获取
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  // 获取订单列表数据
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['recharge-orders'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('recharge_orders')
          .select(`
            *,
            recharge_order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('订单数据查询失败:', error);
          toast({
            variant: "destructive",
            title: "错误",
            description: "获取订单数据失败，请稍后重试"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('订单数据查询失败:', error);
        toast({
          variant: "destructive",
          title: "错误",
          description: "获取订单数据失败，请稍后重试"
        });
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false // 防止频繁刷新
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/wallet/orders"
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
        <MainContent username={mockUser.username} currentPath="/wallet/orders">
          <OrdersTable 
            data={orders || []} 
            isLoading={isLoadingOrders} 
          />
        </MainContent>
      </div>
    </div>
  );
};

export default Orders;