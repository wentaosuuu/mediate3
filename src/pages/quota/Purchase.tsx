import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PriceCalculator } from '@/components/quota/PriceCalculator';
import { OrderList } from '@/components/quota/OrderList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateOrderNumber } from '@/utils/orderUtils';

// 定义服务类型和价格
export const SERVICE_TYPES = [
  { value: 'SMS', label: '短信服务', price: 0.1, unit: '条' },
  { value: 'CALL', label: '外呼服务', price: 0.5, unit: '分钟' },
];

// 订单项类型定义
export interface OrderItem {
  serviceType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const Purchase = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();

  // 获取钱包信息
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // 处理添加订单项
  const handleAddItem = (item: OrderItem) => {
    // 检查是否已存在相同服务类型
    const existingIndex = orderItems.findIndex(i => i.serviceType === item.serviceType);
    
    if (existingIndex >= 0) {
      // 更新已存在的项目
      const newItems = [...orderItems];
      newItems[existingIndex] = {
        ...item,
        quantity: item.quantity + orderItems[existingIndex].quantity,
        totalPrice: (item.quantity + orderItems[existingIndex].quantity) * item.unitPrice
      };
      setOrderItems(newItems);
    } else {
      // 添加新项目
      setOrderItems([...orderItems, item]);
    }

    toast({
      title: "已添加到订单",
      description: `${SERVICE_TYPES.find(s => s.value === item.serviceType)?.label} ${item.quantity}${SERVICE_TYPES.find(s => s.value === item.serviceType)?.unit}`,
    });
  };

  // 处理移除订单项
  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // 处理更新订单项数量
  const handleUpdateQuantity = (index: number, quantity: number) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      quantity,
      totalPrice: quantity * newItems[index].unitPrice
    };
    setOrderItems(newItems);
  };

  // 处理提交订单
  const handleSubmitOrder = async () => {
    try {
      if (orderItems.length === 0) {
        toast({
          variant: "destructive",
          title: "无法提交",
          description: "请先添加服务项目",
        });
        return;
      }

      const orderNumber = generateOrderNumber();
      const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('recharge_orders')
        .insert({
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'PENDING'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 创建订单项
      const { error: itemsError } = await supabase
        .from('recharge_order_items')
        .insert(
          orderItems.map(item => ({
            order_id: order.id,
            service_type: item.serviceType,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice
          }))
        );

      if (itemsError) throw itemsError;

      toast({
        title: "订单提交成功",
        description: `订单号: ${orderNumber}`,
      });

      // 清空订单列表
      setOrderItems([]);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "请稍后重试",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧价格计算器 */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium">价格计算器</h2>
          <PriceCalculator 
            serviceTypes={SERVICE_TYPES}
            onAddItem={handleAddItem}
          />
        </div>

        {/* 右侧订单清单 */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium">订单清单</h2>
          <OrderList
            items={orderItems}
            serviceTypes={SERVICE_TYPES}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
          
          {/* 提交按钮 */}
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0}
            >
              提交申请
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;