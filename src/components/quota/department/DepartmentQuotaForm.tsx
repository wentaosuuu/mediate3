import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';

// 定义服务类型
const serviceTypes = [
  { id: 'sms', name: '短信服务', unit: '条' },
  { id: 'voice', name: '语音服务', unit: '分钟' },
  { id: 'h5', name: 'H5案件公示', unit: '月' },
];

interface DepartmentQuotaFormData {
  timeUnit: string;
  departmentId: string;
  serviceType: string;
  amount: number;
}

export const DepartmentQuotaForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<DepartmentQuotaFormData>({
    defaultValues: {
      timeUnit: 'day',
      departmentId: '',
      serviceType: '',
      amount: 0,
    },
  });

  // 获取部门列表
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');
      
      if (error) throw error;
      return data;
    },
  });

  // 获取钱包余额
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('tenant_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data || { balance: 0 }; // 如果没有找到钱包，返回余额为0
    },
  });

  const onSubmit = async (data: DepartmentQuotaFormData) => {
    try {
      // 检查钱包余额
      if (wallet && data.amount > wallet.balance) {
        toast({
          variant: 'destructive',
          title: '余额不足',
          description: '当前钱包余额不足以完成此次分配',
        });
        return;
      }

      // 获取当前用户的tenant_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!userData) throw new Error('未找到用户信息');

      const now = new Date();
      let endDate = new Date();
      
      // 根据时间维度设置结束时间
      switch (data.timeUnit) {
        case 'week':
          endDate.setDate(now.getDate() + 7);
          break;
        case 'month':
          endDate.setMonth(now.getMonth() + 1);
          break;
        default: // day
          endDate.setDate(now.getDate() + 1);
      }

      // 创建部门额度记录
      const { error } = await supabase.from('department_quotas').insert({
        tenant_id: userData.tenant_id,
        department_id: data.departmentId,
        service_type: data.serviceType,
        quota_amount: data.amount,
        remaining_amount: data.amount,
        time_unit: data.timeUnit,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
      });

      if (error) throw error;

      toast({
        title: '分配成功',
        description: '部门额度已成功分配',
      });
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '分配失败',
        description: '分配部门额度时发生错误',
      });
    }
  };

  if (isLoadingDepartments) {
    return <div>加载中...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-gray-500" />
        <Select
          defaultValue="day"
          onValueChange={(value) => setValue('timeUnit', value)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="选择时间维度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">按天</SelectItem>
            <SelectItem value="week">按周</SelectItem>
            <SelectItem value="month">按月</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">选择部门</label>
          <Select onValueChange={(value) => setValue('departmentId', value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="请选择部门" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">选择服务类型</label>
          <Select onValueChange={(value) => setValue('serviceType', value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="请选择服务类型" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">额度金额</label>
          <Input
            type="number"
            placeholder="请输入分配额度"
            {...register('amount', { valueAsNumber: true })}
            className="w-full"
          />
        </div>
      </div>

      {wallet && (
        <div className="text-sm text-gray-500">
          当前钱包余额：{wallet.balance} 元
        </div>
      )}

      <Button type="submit" className="w-full">
        确认分配
      </Button>
    </form>
  );
};