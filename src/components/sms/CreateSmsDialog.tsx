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

  const handleSmsTypeChange = (type: string) => {
    setSmsType(type);
    setSelectedTemplate("");
    setPhoneNumbers("");
    setPushTime("");
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      toast({
        title: "错误",
        description: "请选择短信模板",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumbers) {
      toast({
        title: "错误",
        description: "请输入手机号码",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 调用 Edge Function 发送短信
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumbers,
          content: "【云宝宝】V3.0测试：您的验证码是123456，请在5分钟内完成验证。"  // 使用实际的短信模板内容
        }
      });

      console.log('短信发送响应:', data); // 添加日志

      if (error) {
        console.error('发送短信错误:', error);
        throw error;
      }

      if (data.success) {
        // 保存短信记录到数据库
        const { error: dbError } = await supabase
          .from('sms_records')
          .insert([
            {
              tenant_id: '12345', // 需要替换为实际的租户ID
              send_code: Math.random().toString(36).substring(7),
              template_name: selectedTemplate,
              sms_type: smsType,
              recipients: phoneNumbers.split(',').map(n => n.trim()),
              content: "【云宝宝】V3.0测试：您的验证码是123456，请在5分钟内完成验证。",
              success_count: data.summary.success,
              fail_count: data.summary.failed,
              status: 'sent'
            }
          ]);

        if (dbError) {
          console.error('保存短信记录错误:', dbError);
          toast({
            title: "记录保存失败",
            description: "短信已发送但保存记录时发生错误",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "发送成功",
          description: `成功发送 ${data.summary.success} 条短信`,
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

              <div className="flex items-start gap-4">
                <span className="text-red-500 mr-1">*</span>
                <span className="w-24">短信内容：</span>
                <div className="flex-1">
                  {selectedTemplate === "template1" ? (
                    <div className="p-2 bg-gray-50 rounded border">【云宝宝】V3.0测试：您的验证码是123456，请在5分钟内完成验证。</div>
                  ) : (
                    <div className="text-red-500">请先选择短信模板</div>
                  )}
                </div>
              </div>

              <PhoneNumberInput
                phoneNumbers={phoneNumbers}
                onPhoneNumbersChange={setPhoneNumbers}
              />

              <PushTimeSelector
                value={pushTime}
                onChange={setPushTime}
              />

              <div className="text-center text-gray-500">
                共{phoneNumbers.split(',').filter(n => n.trim()).length}个手机号码，
                {phoneNumbers.split(',').filter(n => n.trim()).length}个号码一条短信
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "发送中..." : "提交"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Phone preview */}
          <div className="w-[300px] flex-shrink-0">
            <div className="relative w-[300px] h-[600px] bg-white rounded-[36px] shadow-xl border-8 border-gray-800">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-gray-800 rounded-b-2xl"></div>
              <div className="h-full w-full bg-gray-100 rounded-[28px] p-4">
                {selectedTemplate === "template1" ? (
                  <div className="bg-white rounded-lg p-4 shadow mt-8">
                    <p className="text-sm">【云宝宝】V3.0测试：您的验证码是123456，请在5分钟内完成验证。</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 mt-8">
                    短信预览内容将显示在这里
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};