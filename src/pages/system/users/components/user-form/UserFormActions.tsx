
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("UserFormActions");

interface UserFormActionsProps {
  isLoading: boolean;
  currentUser: any | null;
  onCancel: () => void;
}

// 表单操作按钮组件
const UserFormActions = ({ 
  isLoading, 
  currentUser, 
  onCancel 
}: UserFormActionsProps) => {
  // 添加组件级别的日志记录
  logger.debug("渲染表单操作按钮，加载状态:", isLoading);
  
  // 处理取消按钮点击
  const handleCancelClick = () => {
    if (isLoading) {
      logger.info("操作正在进行中，忽略取消点击");
      return;
    }
    logger.info("用户点击取消按钮");
    onCancel();
  };

  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancelClick}
        disabled={isLoading}
        className="min-w-[80px]"
      >
        取消
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="min-w-[80px]"
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            处理中...
          </span>
        ) : (
          currentUser ? "保存" : "创建"
        )}
      </Button>
    </DialogFooter>
  );
};

export default UserFormActions;
