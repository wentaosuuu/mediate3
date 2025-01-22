import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      try {
        // 获取当前用户信息
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('获取用户信息失败:', userError);
          throw new Error('未登录或获取用户信息失败');
        }

        // 获取用户的tenant_id
        const { data: userData, error: tenantError } = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', user.id)
          .maybeSingle();

        if (tenantError || !userData) {
          console.error('获取租户信息失败:', tenantError);
          throw new Error('获取租户信息失败');
        }

        console.log('当前用户tenant_id:', userData.tenant_id);

        // 使用tenant_id查询钱包余额
        const { data: walletData, error } = await supabase
          .from('wallets')
          .select('balance')
          .eq('tenant_id', userData.tenant_id)
          .maybeSingle();
        
        if (error) {
          console.error('获取钱包余额失败:', error);
          throw error;
        }

        console.log('钱包数据:', walletData);
        
        return walletData || { balance: 0 };
      } catch (error) {
        console.error('获取钱包余额失败:', error);
        throw error;
      }
    },
  });
};