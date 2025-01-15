import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SmsSubmitParams {
  phoneNumbers: string[];
  content: string;
  smsType: string;
  templateName: string;
}

interface SmsSubmitResult {
  success: boolean;
  message?: string;
}

export const useSmsSubmit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submit = async ({ phoneNumbers, content, smsType, templateName }: SmsSubmitParams): Promise<SmsSubmitResult> => {
    if (!phoneNumbers.length || !content) {
      toast({
        title: "发送失败",
        description: "手机号码和短信内容不能为空",
        variant: "destructive",
      });
      return { success: false, message: "手机号码和短信内容不能为空" };
    }

    try {
      // 获取当前用户信息
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('用户未登录');
      }

      // 获取用户的 tenant_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        throw new Error('获取用户信息失败');
      }

      // 调用发送短信的 Edge Function
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumbers: phoneNumbers.join(','),
          content,
          smsType,
          templateName,
          tenantId: userData.tenant_id
        }
      });

      if (error) {
        console.error('发送短信失败:', error);
        toast({
          title: "发送失败",
          description: error.message || "请稍后重试",
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }

      console.log('短信发送响应:', data);

      if (data.success) {
        toast({
          title: "发送成功",
          description: data.message || "短信发送成功",
        });
        // 刷新短信记录列表
        queryClient.invalidateQueries({ queryKey: ['smsRecords'] });
        return { success: true };
      } else {
        toast({
          title: "发送失败",
          description: data.message || "发送失败，请稍后重试",
          variant: "destructive",
        });
        return { 
          success: false, 
          message: data.message 
        };
      }
    } catch (error) {
      console.error('发送短信时发生错误:', error);
      const message = "发送短信时发生错误，请稍后重试";
      toast({
        title: "发送失败",
        description: message,
        variant: "destructive",
      });
      return { 
        success: false, 
        message: message 
      };
    }
  };

  return { submit };
};