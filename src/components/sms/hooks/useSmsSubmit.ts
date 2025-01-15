import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseSmsSubmitProps {
  onClose: () => void;
}

export const useSmsSubmit = ({ onClose }: UseSmsSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }

    if (!phoneNumbers) {
      toast({
        title: "提示",
        description: "请输入手机号码",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 显示发送中的提示
      const loadingToast = toast({
        title: "发送中",
        description: "正在发送短信，请稍候...",
        duration: 999999, // 持续显示直到完成
      });
      
      // 调用短信发送API
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumbers,
          content: smsContent
        }
      });

      console.log('短信发送响应:', data);

      // 关闭加载提示
      toast({
        id: loadingToast,
        duration: 0,
      });

      if (error) {
        console.error('发送短信错误:', error);
        toast({
          title: "发送失败",
          description: error.message || "发送短信时发生错误",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
        return;
      }

      if (data.success) {
        // 保存发送记录
        const { error: dbError } = await supabase
          .from('sms_records')
          .insert([
            {
              tenant_id: '12345',
              send_code: Math.random().toString(36).substring(7),
              template_name: selectedTemplate,
              sms_type: smsType,
              recipients: phoneNumbers.split(',').map(n => n.trim()),
              content: smsContent,
              success_count: data.summary.success,
              fail_count: data.summary.failed,
              status: 'sent'
            }
          ]);

        if (dbError) {
          console.error('保存短信记录错误:', dbError);
          toast({
            title: "发送成功但记录保存失败",
            description: "短信已发送但保存记录时发生错误",
            className: "bg-yellow-500 text-white border-yellow-600",
          });
          return;
        }

        // 显示成功提示，包含详细信息
        toast({
          title: "发送成功",
          description: `成功发送 ${data.summary.success} 条短信${data.summary.failed > 0 ? `，失败 ${data.summary.failed} 条` : ''}`,
          className: "bg-green-500 text-white border-green-600",
        });
        onClose();
      } else {
        // 显示失败提示，包含具体原因
        const failureDetails = data.details
          ?.filter(d => d.status === '失败')
          .map(d => `${d.phone}: ${d.message}`)
          .join('\n');

        toast({
          title: "发送失败",
          description: failureDetails || data.error || "短信发送失败，请检查手机号码是否正确",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.error('发送短信失败:', error);
      toast({
        title: "发送失败",
        description: "发送短信时发生错误，请稍后重试",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
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