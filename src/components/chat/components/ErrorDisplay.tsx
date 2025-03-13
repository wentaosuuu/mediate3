
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
          可能是由于百度服务未能正确加载或网络连接问题导致
          {isHttps && 
            <span className="block mt-1 text-amber-600">
              系统已尝试加载百度网站内容。
              如果问题仍然存在，请确认您的网络连接是否正常，
              并且能够通过https://www.baidu.com访问。
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
