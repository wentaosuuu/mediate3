import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SmsTypeSelector } from './SmsTypeSelector';
import { SmsTemplateSelector } from './SmsTemplateSelector';
import { PhoneNumberInput } from './PhoneNumberInput';
import { PushTimeSelector } from './PushTimeSelector';
import { SmsContentPreview } from './SmsContentPreview';
import { PhonePreview } from './PhonePreview';
import { SmsStats } from './SmsStats';
import { ActionButtons } from './ActionButtons';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateSmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSmsDialog = ({ open, onOpenChange }: CreateSmsDialogProps) => {
  const [smsType, setSmsType] = useState<string>("normal");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<string>("");
  const [pushTime, setPushTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const smsContent = "【云宝宝】V3.0测试：您的验证码是123456，请在5分钟内完成验证。";

  const handleSmsTypeChange = (type: string) => {
    setSmsType(type);
    setSelectedTemplate("");
    setPhoneNumbers("");
    setPushTime("");
  };

  const handleSubmit = async () => {
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

      if (data.success) {
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
            className: "bg-yellow-500",
          });
          return;
        }

        toast({
          title: "发送成功",
          description: `成功发送 ${data.summary.success} 条短信`,
          className: "bg-green-500 text-white border-green-600",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "发送失败",
          description: data.error || "短信发送失败，请检查手机号码是否正确",
          variant: "destructive",
        });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">新建短信</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex gap-8">
          {/* Left side - Form content */}
          <div className="flex-1 space-y-6">
            <SmsTypeSelector 
              smsType={smsType}
              onTypeChange={handleSmsTypeChange}
            />

            <div className="space-y-4">
              <SmsTemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />

              <SmsContentPreview 
                selectedTemplate={selectedTemplate}
                content={smsContent}
              />

              <PhoneNumberInput
                phoneNumbers={phoneNumbers}
                onPhoneNumbersChange={setPhoneNumbers}
              />

              <PushTimeSelector
                value={pushTime}
                onChange={setPushTime}
              />

              <SmsStats phoneNumbers={phoneNumbers} />

              <ActionButtons 
                onCancel={() => onOpenChange(false)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Right side - Phone preview */}
          <PhonePreview 
            selectedTemplate={selectedTemplate}
            content={smsContent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};