import React from 'react';

interface SmsSelectorProps {
  smsType: string;
  onTypeChange: (type: string) => void;
}

export const SmsTypeSelector = ({ smsType, onTypeChange }: SmsSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <span>短信类型：</span>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input 
            type="radio" 
            name="smsType" 
            checked={smsType === "normal"}
            onChange={() => onTypeChange("normal")}
          />
          <span>普通文本短信</span>
        </label>
        <label className="flex items-center gap-2">
          <input 
            type="radio" 
            name="smsType" 
            checked={smsType === "voice"}
            onChange={() => onTypeChange("voice")}
          />
          <span>智能外呼通知</span>
        </label>
      </div>
    </div>
  );
};