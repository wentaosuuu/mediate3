import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseSmsSubmitProps {
  onClose: () => void;
}

interface SmsRecord {
  tenant_id: string;
  send_code: string;
  template_name: string;
  sms_type: string;
  recipients: string[];
  content: string;
  success_count: number;
  fail_count: number;
  status: string;
}

// 验证表单数据
const validateForm = (selectedTemplate: string, phoneNumbers: string) => {
  if (!selectedTemplate) {
    return "请选择短信模板";
  }
  if (!phoneNumbers) {
    return "请输入手机号码";
  }
  return null;
};

// 创建短信记录对象
const createSmsRecord = (
  selectedTemplate: string,
  smsType: string,
  phoneNumbers: string,
  smsContent: string,
  summary: { success: number; failed: number }
): SmsRecord => ({
  tenant_id: '12345',
  send_code: Math.random().toString(36).substring(7),
  template_name: selectedTemplate,
  sms_type: smsType,
  recipients: phoneNumbers.split(',').map(n => n.trim()),
  content: smsContent,
  success_count: summary.success,
  fail_count: summary.failed,
  status: 'sent'
});

// 保存短信记录到数据库
const saveSmsRecord = async (record: SmsRecord) => {
  const { error } = await supabase
    .from('sms_records')
    .insert([record]);
  
  if (error) {
    console.error('保存短信记录错误:', error);
    throw new Error('保存短信记录失败');
  }
};

// 显示延迟的 toast 消息
const showDelayedToast = (toast: any, message: { title: string; description: string; variant?: string; className?: string }) => {
  setTimeout(() => {
    toast(message);
  }, 300);
};

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
    const validationError = validateForm(selectedTemplate, phoneNumbers);
    if (validationError) {
      toast({
        title: "提示",
        description: validationError,
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
        try {
          // 创建并保存短信记录
          const smsRecord = createSmsRecord(
            selectedTemplate,
            smsType,
            phoneNumbers,
            smsContent,
            data.summary
          );
          await saveSmsRecord(smsRecord);
          
          // 显示成功提示
          showDelayedToast(toast, {
            title: "发送成功",
            description: `成功发送 ${data.summary.success} 条短信`,
            className: "bg-green-500 text-white border-green-600",
          });
        } catch (dbError) {
          showDelayedToast(toast, {
            title: "发送成功但记录保存失败",
            description: "短信已发送但保存记录时发生错误",
            variant: "destructive",
          });
        }
      } else {
        // 显示失败提示
        showDelayedToast(toast, {
          title: "发送失败",
          description: data.error || "短信发送失败，请检查手机号码是否正确",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('发送短信失败:', error);
      onClose();
      showDelayedToast(toast, {
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