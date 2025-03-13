
import React from 'react';

/**
 * 备用内容组件
 * 
 * 当MaxKB加载失败时显示的备用内容
 */
export const FallbackContent = () => {
  return (
    <div className="flex-1 overflow-hidden flex items-center justify-center">
      <div className="text-center p-6">
        <h3 className="text-lg font-medium mb-2">客服系统暂时不可用</h3>
        <p className="text-gray-500">请稍后再试或联系技术支持</p>
      </div>
    </div>
  );
};
