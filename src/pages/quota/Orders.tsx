import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// 订单状态映射
const orderStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  'PENDING': { label: '待审核', variant: 'secondary' },
  'APPROVED': { label: '已通过', variant: 'default' },
  'REJECTED': { label: '已拒绝', variant: 'destructive' }
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
          <TableHeader>
            <TableRow>
              <TableHead>订单编号</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>服务项目</TableHead>
              <TableHead className="text-right">总金额</TableHead>
              <TableHead className="text-center">状态</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell>{order.order_number}</TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.recharge_order_items?.map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.service_type} × {item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ¥{order.total_amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Badge variant={orderStatusMap[order.status]?.variant || 'secondary'}>
                      {orderStatusMap[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {order.reject_reason || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;