
import React from 'react';

/**
 * MaxKB容器组件
 * 
 * 作为MaxKB客服系统的挂载点
 */
interface MaxKbContainerProps {
  containerId: string;
  isHidden: boolean;
}

export const MaxKbContainer = ({ containerId, isHidden }: MaxKbContainerProps) => {
  return (
    <div 
      id={containerId} 
      className={`flex-1 w-full ${isHidden ? 'hidden' : ''}`}
    />
  );
};
