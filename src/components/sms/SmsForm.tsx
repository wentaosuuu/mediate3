import React from 'react';
import { SmsTypeSelector } from './SmsTypeSelector';
import { SmsTemplateSelector } from './SmsTemplateSelector';
import { SmsContentPreview } from './SmsContentPreview';
import { PhoneNumberInput } from './PhoneNumberInput';
import { PushTimeSelector } from './PushTimeSelector';
import { SmsStats } from './SmsStats';
import { ActionButtons } from './ActionButtons';

interface SmsFormProps {
  smsType: string;
  selectedTemplate: string;
  phoneNumbers: string;
  pushTime: string;
  smsContent: string;
  isSubmitting: boolean;
  onSmsTypeChange: (type: string) => void;
  onTemplateChange: (template: string) => void;
  onPhoneNumbersChange: (numbers: string) => void;
  onPushTimeChange: (time: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const SmsForm = ({
  smsType,
  selectedTemplate,
  phoneNumbers,
  pushTime,
  smsContent,
  isSubmitting,
  onSmsTypeChange,
  onTemplateChange,
  onPhoneNumbersChange,
  onPushTimeChange,
  onCancel,
  onSubmit
}: SmsFormProps) => {
  return (
    <div className="flex-1 space-y-6">
      <SmsTypeSelector 
        smsType={smsType}
        onTypeChange={onSmsTypeChange}
      />

      <div className="space-y-4">
        <SmsTemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={onTemplateChange}
        />

        <SmsContentPreview 
          selectedTemplate={selectedTemplate}
          content={smsContent}
        />

        <PhoneNumberInput
          phoneNumbers={phoneNumbers}
          onPhoneNumbersChange={onPhoneNumbersChange}
        />

        <PushTimeSelector
          value={pushTime}
          onChange={onPushTimeChange}
        />

        <SmsStats phoneNumbers={phoneNumbers} />

        <ActionButtons 
          onCancel={onCancel}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};