import React from 'react';
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
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

  return (
    <Badge className={getStatusBadgeStyle(status)}>
      {getStatusText(status)}
    </Badge>
  );
};