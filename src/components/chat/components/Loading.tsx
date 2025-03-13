
import React from 'react';
import { Loader } from 'lucide-react';

/**
 * 加载中组件
 * 
 * 显示加载动画和提示文本
 */
export const Loading = ({ message = "正在连接客服系统..." }: { message?: string }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            加载中...
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};
