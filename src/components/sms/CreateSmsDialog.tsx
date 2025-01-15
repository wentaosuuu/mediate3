import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PhonePreview } from './PhonePreview';
import { SmsForm } from './SmsForm';
import { useSmsSubmit } from './hooks/useSmsSubmit';

interface CreateSmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSmsDialog = ({ open, onOpenChange }: CreateSmsDialogProps) => {
  // 状态管理
  const [smsType, setSmsType] = useState<string>("normal");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<string>("");
  const [pushTime, setPushTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 短信内容 - 后续可以根据模板动态生成
  const smsContent = "【云宝宝】V3.0测试：您的验证码是123456，请在5分钟内完成验证。";

  // 提交逻辑
  const { submit } = useSmsSubmit();

  // 处理提交
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submit({
        phoneNumbers: phoneNumbers.split(','),
        content: smsContent,
        smsType,
        templateName: selectedTemplate
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理短信类型变更
  const handleSmsTypeChange = (type: string) => {
    setSmsType(type);
    setSelectedTemplate("");
    setPhoneNumbers("");
    setPushTime("");
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
          {/* 左侧表单 */}
          <SmsForm
            smsType={smsType}
            selectedTemplate={selectedTemplate}
            phoneNumbers={phoneNumbers}
            pushTime={pushTime}
            smsContent={smsContent}
            isSubmitting={isSubmitting}
            onSmsTypeChange={handleSmsTypeChange}
            onTemplateChange={setSelectedTemplate}
            onPhoneNumbersChange={setPhoneNumbers}
            onPushTimeChange={setPushTime}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
          />

          {/* 右侧手机预览 */}
          <PhonePreview 
            selectedTemplate={selectedTemplate}
            content={smsContent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};