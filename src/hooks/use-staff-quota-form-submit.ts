import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffQuotaFormData } from '@/types/quota';

export const useStaffQuotaFormSubmit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: StaffQuotaFormData) => {
    try {
      // 检查必填字段
      if (!data.departmentQuotaId || !data.staffId || !data.amount) {
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

      // 获取部门配额信息
      const { data: departmentQuota, error: quotaError } = await supabase
        .from('department_quotas')
        .select('remaining_amount')
        .eq('id', data.departmentQuotaId)
        .single();

      if (quotaError || !departmentQuota) {
        throw new Error('获取部门配额信息失败');
      }

      // 检查分配额度是否超过剩余额度
      if (data.amount > departmentQuota.remaining_amount) {
        toast({
          variant: 'destructive',
          title: '额度不足',
          description: '分配额度超过部门剩余额度',
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
          duration: 2000,
        });
        return false;
      }

      // 创建作业员额度记录
      const { error: insertError } = await supabase
        .from('staff_quotas')
        .insert({
          tenant_id: userData.tenant_id,
          department_quota_id: data.departmentQuotaId,
          staff_id: data.staffId,
          quota_amount: data.amount,
          remaining_amount: data.amount,
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

      // 更新部门配额的剩余额度
      const { error: updateError } = await supabase
        .from('department_quotas')
        .update({
          remaining_amount: departmentQuota.remaining_amount - data.amount
        })
        .eq('id', data.departmentQuotaId);

      if (updateError) {
        console.error('更新错误:', updateError);
        toast({
          variant: 'destructive',
          title: '更新失败',
          description: `错误信息: ${updateError.message}`,
          className: 'fixed top-4 left-1/2 -translate-x-1/2',
          duration: 2000,
        });
        return false;
      }

      // 刷新历史记录列表
      await queryClient.invalidateQueries({ queryKey: ['staff-quotas'] });
      await queryClient.invalidateQueries({ queryKey: ['department-quotas'] });

      // 显示成功消息
      toast({
        title: '分配成功',
        description: '作业员额度已成功分配',
        className: 'fixed top-4 left-1/2 -translate-x-1/2 bg-green-50 border-green-200 text-green-800',
        duration: 2000,
      });

      return true;
    } catch (error) {
      console.error('分配额度失败:', error);
      toast({
        variant: 'destructive',
        title: '分配失败',
        description: error instanceof Error ? error.message : '分配作业员额度时发生错误',
        className: 'fixed top-4 left-1/2 -translate-x-1/2',
        duration: 2000,
      });
      return false;
    }
  };

  return { handleSubmit };
};