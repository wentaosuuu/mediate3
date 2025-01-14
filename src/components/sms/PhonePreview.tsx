import React from 'react';

interface PhonePreviewProps {
  selectedTemplate: string;
  content: string;
}

export const PhonePreview = ({ selectedTemplate, content }: PhonePreviewProps) => {
  return (
    <div className="w-[300px] flex-shrink-0">
      <div className="relative w-[300px] h-[600px] bg-white rounded-[36px] shadow-xl border-8 border-gray-800">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-gray-800 rounded-b-2xl"></div>
        <div className="h-full w-full bg-gray-100 rounded-[28px] p-4">
          {selectedTemplate ? (
            <div className="bg-white rounded-lg p-4 shadow mt-8">
              <p className="text-sm">{content}</p>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-8">
              短信预览内容将显示在这里
            </div>
          )}
        </div>
      </div>
    </div>
  );
};