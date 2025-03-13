
import React from 'react';

/**
 * 备用内容组件
 * 
 * 当MaxKB加载失败时显示的备用内容
 */
export const FallbackContent = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <iframe 
        src="https://www.bing.com" 
        className="w-full h-full border-0"
        title="备用客服窗口"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};
