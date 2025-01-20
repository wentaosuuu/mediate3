import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ServiceSelector } from './ServiceSelector';
import { OrderItemList } from './OrderItemList';
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
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // 获取选中服务的详细信息
  const getServiceDetails = (serviceId: string) => {
    return serviceTypes.find(service => service.id === serviceId);
  };

  // 添加到订单
  const handleAddToOrder = () => {
    if (!selectedService || !quantity || Number(quantity) <= 0) {
      toast.error('请选择服务类型并输入有效的数量');
      return;
    }

    const serviceDetails = getServiceDetails(selectedService);
    if (!serviceDetails) return;

    const newItem: OrderItem = {
      serviceType: serviceDetails.name,
      quantity: Number(quantity),
      unitPrice: serviceDetails.price,
      totalPrice: serviceDetails.price * Number(quantity)
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedService('');
    setQuantity('');
    toast.success('已添加到订单');
  };

  // 删除订单项
  const handleRemoveItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  // 提交订单
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('请至少添加一项服务');
      return;
    }

    try {
      // 获取当前用户信息
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('请先登录');
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
        toast.error('获取用户信息失败');
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

      toast.success('订单提交成功');
      navigate('/wallet/orders');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('订单提交失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">购买额度</h2>
        
        <ServiceSelector
          selectedService={selectedService}
          quantity={quantity}
          serviceTypes={serviceTypes}
          onServiceChange={setSelectedService}
          onQuantityChange={setQuantity}
        />

        <Button onClick={handleAddToOrder}>添加到订单</Button>
      </Card>

      {orderItems.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">订单明细</h3>
          <OrderItemList
            items={orderItems}
            onRemoveItem={handleRemoveItem}
          />
          <OrderSummary
            items={orderItems}
            onSubmit={handleSubmitOrder}
          />
        </Card>
      )}
    </div>
  );
};