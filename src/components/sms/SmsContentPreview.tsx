import React from 'react';

interface SmsContentPreviewProps {
  selectedTemplate: string;
  content: string;
}

export const SmsContentPreview = ({ selectedTemplate, content }: SmsContentPreviewProps) => {
  return (
    <div className="flex items-start gap-4">
      <span className="text-red-500 mr-1">*</span>
      <span className="w-24">短信内容：</span>
      <div className="flex-1">
        {selectedTemplate ? (
          <div className="p-2 bg-gray-50 rounded border">{content}</div>
        ) : (
          <div className="text-red-500">请先选择短信模板</div>
        )}
      </div>
    </div>
  );
};