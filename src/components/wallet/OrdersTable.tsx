import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderServiceItems } from './OrderServiceItems';

interface OrderItem {
  service_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  recharge_order_items: OrderItem[];
  created_by?: {
    username: string;
  } | null;
}

interface OrdersTableProps {
  data: Order[];
  isLoading: boolean;
}

export const OrdersTable = ({ data, isLoading }: OrdersTableProps) => {
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">订单号</TableHead>
            <TableHead className="w-[180px]">创建时间</TableHead>
            <TableHead>服务项目</TableHead>
            <TableHead className="w-[120px] text-right">总金额</TableHead>
            <TableHead className="w-[100px]">订单状态</TableHead>
            <TableHead className="w-[100px]">创建人</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                暂无订单数据
              </TableCell>
            </TableRow>
          ) : (
            data.map((order) => (
              <TableRow key={order.id} className="group hover:bg-gray-50">
                <TableCell className="font-medium">
                  {order.order_number}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell>
                  <OrderServiceItems items={order.recharge_order_items} />
                </TableCell>
                <TableCell className="text-right">
                  ¥ {order.total_amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{order.created_by?.username || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};