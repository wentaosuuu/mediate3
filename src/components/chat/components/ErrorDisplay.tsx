
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
          可能是由于以下原因之一导致：
          <ul className="mt-2 list-disc text-left pl-5">
            <li>MaxKB服务不可达（http://127.0.0.1:8080）</li>
            <li>浏览器的混合内容阻止（当HTTPS页面加载HTTP内容）</li>
            <li>网络连接中断</li>
          </ul>
          {isHttps && 
            <span className="block mt-2 text-amber-600">
              检测到您正在使用HTTPS协议访问，但客服系统使用的是HTTP协议。
              浏览器安全策略可能会阻止HTTPS页面加载HTTP资源，这称为"混合内容"问题。
              请尝试以下解决方案：
              <br/>
              1. 在浏览器地址栏点击"盾牌"图标，允许加载不安全内容
              <br/>
              2. 或者使用HTTP协议访问本站
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
