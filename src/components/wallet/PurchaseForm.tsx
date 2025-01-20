import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// 服务类型定义
const serviceTypes = [
  { id: 'sms', name: '短信服务', price: 0.04, unit: '条' },
  { id: 'mms', name: '彩信服务', price: 0.18, unit: '条' },
  { id: 'voice', name: '外呼服务', price: 0.18, unit: '分钟' },
  { id: 'h5_system', name: 'H5案件公示系统', price: 1200, unit: '月' },
  { id: 'seat', name: '坐席服务', price: 150, unit: '月/坐席' },
  { id: 'number_auth', name: '号码认证', price: 580, unit: '年/个' },
];

interface OrderItem {
  serviceType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

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

  // 计算总价
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
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
      
      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('recharge_orders')
        .insert({
          order_number: orderNumber,
          tenant_id: userData.tenant_id,
          total_amount: calculateTotal(),
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
        
        {/* 服务选择表单 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label>服务类型</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="请选择服务类型" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.price}元/{service.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>购买数量</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="请输入数量"
            />
          </div>
        </div>

        <Button onClick={handleAddToOrder}>添加到订单</Button>
      </Card>

      {/* 订单列表 */}
      {orderItems.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">订单明细</h3>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.serviceType}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.unitPrice} 元
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{item.totalPrice.toFixed(2)} 元</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-semibold">总计</span>
              <span className="text-xl font-bold text-primary">
                {calculateTotal().toFixed(2)} 元
              </span>
            </div>

            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={handleSubmitOrder}
            >
              提交订单
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};