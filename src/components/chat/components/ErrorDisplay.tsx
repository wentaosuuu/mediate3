
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
            <li>MaxKB服务不可达（https://maxkb.fit2cloud.com）</li>
            <li>网络连接中断</li>
            <li>服务器临时维护中</li>
          </ul>
          {isHttps && 
            <span className="block mt-2 text-amber-600">
              如果您无法连接到客服系统，可能是网络问题或当前服务不可用。
              <br/>
              <strong>解决方法：</strong>
              <ol className="list-decimal text-left pl-5 mt-1">
                <li>
                  检查您的网络连接是否正常
                </li>
                <li>
                  如果您使用的是公司或组织网络，可能存在访问限制
                </li>
                <li>
                  稍后再试或联系系统管理员
                </li>
              </ol>
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
