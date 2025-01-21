import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceSelector } from './ServiceSelector';
import { OrderSummary } from './OrderSummary';
import { OrderItem, ServiceType } from './types';

// 服务类型定义
const serviceTypes: ServiceType[] = [
  { id: 'sms', name: '短信服务', price: 0.04, unit: '条' },
  { id: 'mms', name: '彩信服务', price: 0.18, unit: '条' },
  { id: 'voice', name: '外呼服务', price: 0.18, unit: '分钟' },
  { id: 'h5_system', name: 'H5案件公示系统', price: 1200, unit: '月' },
  { id: 'seat', name: '坐席服务', price: 150, unit: '月/坐席' },
  { id: 'number_auth', name: '号码认证', price: 580, unit: '年/个' },
];

export const PurchaseForm = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 计算订单项
  const orderItems: OrderItem[] = Object.entries(selectedServices)
    .filter(([_, quantity]) => quantity > 0)
    .map(([serviceId, quantity]) => {
      const service = serviceTypes.find(s => s.id === serviceId)!;
      return {
        serviceType: service.name,
        quantity: quantity,
        unitPrice: service.price,
        totalPrice: service.price * quantity
      };
    });

  // 处理数量变更
  const handleQuantityChange = (serviceId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: quantity
    }));
  };

  // 提交订单
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "提交失败",
        description: "请至少选择一项服务",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 获取当前用户信息
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "提交失败",
          description: "请先登录",
          variant: "destructive"
        });
        return;
      }

      // 获取用户的 tenant_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        toast({
          title: "提交失败",
          description: "获取用户信息失败",
          variant: "destructive"
        });
        return;
      }

      // 生成订单号
      const orderNumber = `PO${Date.now()}`;
      const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('recharge_orders')
        .insert({
          order_number: orderNumber,
          tenant_id: userData.tenant_id,
          total_amount: totalAmount,
          status: 'PENDING',
          created_by: user.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 创建订单项
      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        service_type: item.serviceType,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice
      }));

      const { error: itemsError } = await supabase
        .from('recharge_order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      toast({
        title: "提交成功",
        description: "订单已提交，请等待审核",
      });
      
      // 重置表单
      setSelectedServices({});
      navigate('/wallet/orders');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "提交失败",
        description: "订单提交失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">购买额度</h2>
        <ServiceSelector
          serviceTypes={serviceTypes}
          selectedServices={selectedServices}
          onQuantityChange={handleQuantityChange}
        />
      </Card>

      <OrderSummary
        items={orderItems}
        onSubmit={handleSubmitOrder}
        isOpen={isDetailsOpen}
        onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};