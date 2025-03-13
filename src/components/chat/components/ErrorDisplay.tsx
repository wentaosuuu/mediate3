
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

/**
 * 错误显示组件
 * 
 * 显示错误信息和操作按钮
 */
interface ErrorDisplayProps {
  onRetry: () => void;
  onUseFallback: () => void;
  isHttps?: boolean;
}

export const ErrorDisplay = ({ onRetry, onUseFallback, isHttps = false }: ErrorDisplayProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
        <p className="text-red-500 mb-4">客服系统连接失败</p>
        <p className="mb-4 text-sm text-gray-500">
          可能是由于MaxKB服务未启动、网络问题或跨域限制导致
          {isHttps && 
            <span className="block mt-1 text-amber-600">
              检测到您正在使用HTTPS，系统将尝试通过HTTPS连接MaxKB。
              如果您的MaxKB服务仅支持HTTP，请确保您的浏览器允许混合内容或切换到HTTP访问本站。
            </span>
          }
        </p>
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mr-2"
        >
          重试连接
        </Button>
        <Button 
          onClick={onUseFallback}
          variant="default"
        >
          使用备用系统
        </Button>
      </div>
    </div>
  );
};
