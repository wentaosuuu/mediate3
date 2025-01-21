import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrdersTable } from '@/components/wallet/OrdersTable';
import { MainContent } from '@/components/dashboard/MainContent';
import { useLocation } from 'react-router-dom';

const Orders = () => {
  const location = useLocation();
  
  // 获取当前用户信息
  const { data: { user } } = await supabase.auth.getUser();
  const username = user?.email?.split('@')[0] || null;
  
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
    <MainContent currentPath={location.pathname} username={username}>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">充值订单管理</h1>
        <OrdersTable data={orders || []} isLoading={isLoading} />
      </div>
    </MainContent>
  );
};

export default Orders;