import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// 订单状态映射
const orderStatusMap = {
  'PENDING': { label: '待审核', color: 'bg-yellow-100 text-yellow-800' },
  'APPROVED': { label: '已通过', color: 'bg-green-100 text-green-800' },
  'REJECTED': { label: '已拒绝', color: 'bg-red-100 text-red-800' }
};

const Orders = () => {
  // 获取订单列表
  const { data: orders, isLoading } = useQuery({
    queryKey: ['rechargeOrders'],
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
    }
  });

  if (isLoading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">订单管理</h2>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 text-left">订单编号</th>
              <th className="py-4 px-6 text-left">创建时间</th>
              <th className="py-4 px-6 text-left">服务项目</th>
              <th className="py-4 px-6 text-right">总金额</th>
              <th className="py-4 px-6 text-center">状态</th>
              <th className="py-4 px-6 text-left">备注</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{order.order_number}</td>
                <td className="py-4 px-6">
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm:ss')}
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {order.recharge_order_items?.map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.service_type} × {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  ¥{order.total_amount.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <Badge 
                      className={`${orderStatusMap[order.status as keyof typeof orderStatusMap].color}`}
                    >
                      {orderStatusMap[order.status as keyof typeof orderStatusMap].label}
                    </Badge>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {order.reject_reason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;