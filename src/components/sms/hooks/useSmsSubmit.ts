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
      // 调用发送短信的 Edge Function
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumbers: phoneNumbers.join(','),
          content,
          smsType,
          templateName
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

      // 处理发送结果
      if (data.success) {
        // 全部发送成功
        toast({
          title: "发送成功",
          description: `成功发送 ${data.summary.success} 条短信`,
        });
        // 刷新短信记录列表
        queryClient.invalidateQueries({ queryKey: ['smsRecords'] });
        return { success: true };
      } else {
        // 构建失败信息
        const failureDetails = data.details
          .filter(detail => detail.status === '失败')
          .map(detail => `${detail.phone}: ${detail.message}`)
          .join('\n');

        const failureMessage = failureDetails ? `\n失败详情:\n${failureDetails}` : '';
        const message = `成功：${data.summary.success}条\n失败：${data.summary.failed}条\n${failureMessage}`;

        toast({
          title: data.summary.success > 0 ? "部分发送成功" : "发送失败",
          description: message,
          variant: "destructive",
        });

        if (data.summary.success > 0) {
          // 如果有部分成功，也刷新列表
          queryClient.invalidateQueries({ queryKey: ['smsRecords'] });
        }
        
        return { 
          success: false, 
          message: message 
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