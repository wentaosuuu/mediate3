import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OrdersTable } from '@/components/wallet/OrdersTable';
import { MainContent } from '@/components/dashboard/MainContent';

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  
  // 获取当前用户信息
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUsername(user?.email?.split('@')[0] || null);
    };
    
    fetchUser();
  }, []);
  
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
    <MainContent username={username} currentPath={location.pathname}>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">充值订单管理</h1>
        <OrdersTable data={orders || []} isLoading={isLoading} />
      </div>
    </MainContent>
  );
};

export default Orders;