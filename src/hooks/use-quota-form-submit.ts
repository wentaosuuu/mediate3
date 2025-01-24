import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DepartmentQuotaFormData } from '@/types/quota';

export const useQuotaFormSubmit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: DepartmentQuotaFormData, walletBalance?: number) => {
    try {
      // 检查钱包余额
      if (walletBalance !== undefined && data.amount > walletBalance) {
        toast({
          variant: 'destructive',
          title: '余额不足',
          description: '当前钱包余额不足以完成此次分配',
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
          duration: 2000,
        });
        return false;
      }

      // 检查必填字段
      if (!data.departmentId || !data.amount) {
        toast({
          variant: 'destructive',
          title: '表单错误',
          description: '请填写所有必填字段',
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
          duration: 2000,
        });
        return false;
      }

      // 获取当前用户信息
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('未登录或获取用户信息失败');
      }

      // 获取用户的tenant_id
      const { data: userData, error: tenantError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .maybeSingle();

      if (tenantError || !userData) {
        throw new Error('获取租户信息失败');
      }

      // 设置日期范围
      let startDate = new Date();
      let endDate = new Date();
      
      if (data.timeUnit === 'custom' && data.dateRange) {
        startDate = data.dateRange.from || new Date();
        endDate = data.dateRange.to || new Date();
      } else {
        switch (data.timeUnit) {
          case 'week':
            endDate.setDate(startDate.getDate() + 7);
            break;
          case 'month':
            endDate.setMonth(startDate.getMonth() + 1);
            break;
          default: // day
            endDate.setDate(startDate.getDate() + 1);
        }
      }

      // 创建部门额度记录
      const { error: insertError } = await supabase
        .from('department_quotas')
        .insert({
          tenant_id: userData.tenant_id,
          department_id: data.departmentId,
          quota_amount: data.amount,
          remaining_amount: data.amount,
          time_unit: data.timeUnit,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          created_by: user.id,
        });

      if (insertError) {
        console.error('插入错误:', insertError);
        toast({
          variant: 'destructive',
          title: '提交失败',
          description: `错误信息: ${insertError.message}`,
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
          duration: 2000,
        });
        return false;
      }

      // 刷新历史记录列表
      await queryClient.invalidateQueries({ queryKey: ['department-quotas'] });

      // 显示成功消息
      toast({
        title: '分配成功',
        description: '部门额度已成功分配',
        className: 'fixed top-4 left-1/2 -translate-x-1/2 bg-green-50 border-green-200 text-green-800',
        duration: 2000,
      });

      return true;
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '分配失败',
        description: error instanceof Error ? error.message : '分配部门额度时发生错误',
        className: 'fixed top-4 left-1/2 -translate-x-1/2',
        duration: 2000,
      });
      return false;
    }
  };

  return { handleSubmit };
};