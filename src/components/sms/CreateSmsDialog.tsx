import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar } from "lucide-react";

interface CreateSmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSmsDialog = ({ open, onOpenChange }: CreateSmsDialogProps) => {
  const [smsType, setSmsType] = useState<string>("normal");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<string>("");
  const templateContent = "【云宝宝】法调云V3.0短信触达服务测试";

  const handleSmsTypeChange = (type: string) => {
    setSmsType(type);
    setSelectedTemplate("");
    setPhoneNumbers("");
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
            <div className="flex items-center gap-4">
              <span>短信类型：</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="smsType" 
                    checked={smsType === "normal"}
                    onChange={() => handleSmsTypeChange("normal")}
                  />
                  <span>普通文本短信</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="smsType" 
                    checked={smsType === "voice"}
                    onChange={() => handleSmsTypeChange("voice")}
                  />
                  <span>智能外呼通知</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-red-500 mr-1">*</span>
                <span className="w-24">短信模板：</span>
                <div className="flex-1">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="bg-white w-[260px]">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="template1">模板一</SelectItem>
                      <SelectItem value="template2">模板二</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-red-500 mr-1">*</span>
                <span className="w-24">短信内容：</span>
                <div className="flex-1">
                  {selectedTemplate === "template1" ? (
                    <div className="p-2 bg-gray-50 rounded border">{templateContent}</div>
                  ) : (
                    <div className="text-red-500">请先选择短信模板</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-red-500 mr-1">*</span>
                <span className="w-24">发送用户及发送数据：</span>
                <div className="flex-1 flex gap-2">
                  <Input 
                    placeholder="请输入手机号码，多个号码用逗号分隔" 
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    className="bg-white flex-1"
                  />
                  <Button variant="outline" className="bg-white whitespace-nowrap">
                    导入发送用户
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="w-[116px]">推送时间：</span>
                <div className="flex-1">
                  <div className="relative w-[260px]">
                    <Input 
                      type="datetime-local" 
                      className="bg-white pr-10" 
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                  <div className="text-red-500 text-sm mt-1">*发送时间非必填项，设置发送时间则按照发送时间发送</div>
                </div>
              </div>

              <div className="text-center text-gray-500">
                共{phoneNumbers.split(',').filter(n => n.trim()).length}个手机号码，{phoneNumbers.split(',').filter(n => n.trim()).length}个号码一条短信
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button type="submit">提交</Button>
              </div>
            </div>
          </div>

          {/* Right side - Phone preview */}
          <div className="w-[300px] flex-shrink-0">
            <div className="relative w-[300px] h-[600px] bg-white rounded-[36px] shadow-xl border-8 border-gray-800">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-gray-800 rounded-b-2xl"></div>
              {/* Phone screen */}
              <div className="h-full w-full bg-gray-100 rounded-[28px] p-4">
                {selectedTemplate === "template1" ? (
                  <div className="bg-white rounded-lg p-4 shadow mt-8">
                    <p className="text-sm">{templateContent}</p>
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