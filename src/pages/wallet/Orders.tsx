import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrdersTable } from '@/components/wallet/OrdersTable';

const Orders = () => {
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">充值订单管理</h1>
      <OrdersTable data={orders || []} isLoading={isLoading} />
    </div>
  );
};

export default Orders;