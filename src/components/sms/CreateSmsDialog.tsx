import React from 'react';
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
import { X } from "lucide-react";

interface CreateSmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSmsDialog = ({ open, onOpenChange }: CreateSmsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
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
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span>短信类型：</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="smsType" defaultChecked />
                <span>普通文本短信</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="smsType" />
                <span>智能外呼通知</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-red-500 mr-1">*</span>
              <span className="w-24">短信模板：</span>
              <Select className="flex-1">
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="template1">模板一</SelectItem>
                  <SelectItem value="template2">模板二</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-red-500 mr-1">*</span>
              <span className="w-24">短信内容：</span>
              <div className="flex-1">
                <div className="text-red-500">请先选择短信模板</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-red-500 mr-1">*</span>
              <span className="w-24">发送用户及发送数据：</span>
              <div className="flex-1">
                <div className="text-red-500">请先选择短信模板</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-[116px]">推送时间：</span>
              <div className="flex-1">
                <Input type="datetime-local" className="bg-white" />
                <div className="text-red-500 text-sm mt-1">*发送时间非必填项，设置发送时间则按照发送时间发送</div>
              </div>
            </div>

            <div className="text-center text-gray-500">
              共0个手机号码，0个号码一条短信
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="submit">提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};