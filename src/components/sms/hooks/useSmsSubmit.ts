import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';

interface UseSmsSubmitProps {
  onClose: () => void;
}

export const useSmsSubmit = ({ onClose }: UseSmsSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    selectedTemplate: string,
    phoneNumbers: string,
    smsType: string,
    smsContent: string
  ) => {
    // 验证表单
    if (!selectedTemplate) {
      toast({
        title: "提示",
        description: "请选择短信模板",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumbers) {
      toast({
        title: "提示",
        description: "请输入手机号码",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 显示发送中的提示
      toast({
        title: "发送中",
        description: "正在发送短信，请稍候...",
      });
      
      // 调用短信发送API
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumbers,
          content: smsContent,
          smsType,
          templateName: selectedTemplate
        }
      });

      if (error) {
        console.error('发送短信错误:', error);
        toast({
          title: "发送失败",
          description: error.message || "发送短信时发生错误",
          variant: "destructive",
        });
        return;
      }

      // 根据发送结果显示不同的提示
      if (data.success) {
        toast({
          title: "发送成功",
          description: `成功发送 ${data.summary.success} 条短信`,
          variant: "default",  // 修改这里，使用 default 替代 success
        });
        // 刷新短信记录列表
        queryClient.invalidateQueries({ queryKey: ['smsRecords'] });
        onClose();
      } else {
        // 部分成功或全部失败的情况
        const failureMessage = data.details
          .filter(d => d.status === '失败')
          .map(d => `${d.phone}: ${d.message}`)
          .join('\n');

        toast({
          title: data.summary.success > 0 ? "部分发送成功" : "发送失败",
          description: `成功：${data.summary.success}条\n失败：${data.summary.failed}条\n${failureMessage}`,
          variant: data.summary.success > 0 ? "default" : "destructive", // 修改这里，使用 default 替代 secondary
        });

        if (data.summary.success > 0) {
          // 如果有部分成功，也关闭对话框
          queryClient.invalidateQueries({ queryKey: ['smsRecords'] });
          onClose();
        }
      }
    } catch (error) {
      console.error('发送短信失败:', error);
      toast({
        title: "发送失败",
        description: "发送短信时发生错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};