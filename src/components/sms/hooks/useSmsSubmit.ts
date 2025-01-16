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
      
      // 调用短信发送API
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumbers,
          content: smsContent
        }
      });

      console.log('短信发送响应:', data);

      if (error) {
        console.error('发送短信错误:', error);
        throw error;
      }

      // 先关闭弹窗
      onClose();

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
            variant: "destructive",
          });
          return;
        }

        // 显示成功提示
        toast({
          title: "发送成功",
          description: `成功发送 ${data.summary.success} 条短信`,
          className: "bg-green-500 text-white border-green-600",
        });
      } else {
        // 显示失败提示
        toast({
          title: "发送失败",
          description: data.error || "短信发送失败，请检查手机号码是否正确",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('发送短信失败:', error);
      // 先关闭弹窗
      onClose();
      // 显示错误提示
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