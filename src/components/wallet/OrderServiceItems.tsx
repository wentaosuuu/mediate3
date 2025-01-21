import React from 'react';

interface OrderItem {
  service_type: string;
  quantity: number;
}

interface OrderServiceItemsProps {
  items: OrderItem[];
}

export const OrderServiceItems = ({ items }: OrderServiceItemsProps) => {
  // 格式化服务项目显示
  const formatServiceItems = (items: OrderItem[]) => {
    return items.map(item => (
      `${item.service_type} × ${item.quantity}`
    )).join(', ');
  };

  return (
    <span className="text-sm text-gray-600">
      {formatServiceItems(items)}
    </span>
  );
};