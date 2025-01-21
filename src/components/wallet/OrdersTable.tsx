import React from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  // 获取订单状态对应的样式
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'APPROVED':
        return 'bg-green-500 hover:bg-green-600';
      case 'REJECTED':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // 格式化订单状态显示文本
  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return '待审核';
      case 'APPROVED':
        return '已通过';
      case 'REJECTED':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  // 格式化服务项目显示
  const formatServiceItems = (items: OrderItem[]) => {
    return items.map(item => (
      `${item.service_type} × ${item.quantity}`
    )).join(', ');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        加载中...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>订单号</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>服务项目</TableHead>
            <TableHead>总金额</TableHead>
            <TableHead>订单状态</TableHead>
            <TableHead>创建人</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                暂无订单数据
              </TableCell>
            </TableRow>
          ) : (
            data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_number}</TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell>{formatServiceItems(order.recharge_order_items)}</TableCell>
                <TableCell>¥ {order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
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