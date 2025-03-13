
import React, { useState, useEffect, useRef } from 'react';
import { Loading } from './Loading';
import { ErrorDisplay } from './ErrorDisplay';
import { MaxKbContainer } from './MaxKbContainer';
import { FallbackContent } from './FallbackContent';

/**
 * 客服对话框组件
 * 
 * 包含MaxKB客服窗口，处理加载、错误和内容展示
 */
interface CustomerServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CustomerServiceDialog = ({ isOpen, onOpenChange }: CustomerServiceDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const scriptLoaded = useRef(false);
  const maxKbContainerId = "maxkb-container";
  
  // 加载MaxKB客服脚本
  useEffect(() => {
    if (isOpen && !scriptLoaded.current) {
      setIsLoading(true);
      setLoadError(false);
      setShowFallback(false);
      
      const script = document.createElement('script');
      
      // 使用动态协议
      const currentProtocol = window.location.protocol;
      // 基本URL，去掉协议部分
      const baseUrl = "127.0.0.1:8080";
      // 如果当前是HTTPS，尝试也使用HTTPS访问MaxKB；否则使用HTTP
      const protocol = currentProtocol === 'https:' ? 'https' : 'http';
      
      // 构建脚本URL
      script.src = `${protocol}://${baseUrl}/api/application/embed?protocol=${protocol}&host=${baseUrl}&token=62bacb3e3b761714`;
      script.async = true;
      script.defer = true;
      
      // 脚本加载成功处理
      script.onload = () => {
        console.log(`MaxKB脚本加载成功 (使用${protocol}协议)`);
        scriptLoaded.current = true;
        setIsLoading(false);
        
        // 检查MaxKB是否在容器中成功初始化
        setTimeout(() => {
          const container = document.getElementById(maxKbContainerId);
          if (container && container.childElementCount === 0) {
            console.log("MaxKB未能成功初始化，可能是连接问题");
            setLoadError(true);
          }
        }, 3000); // 给MaxKB 3秒钟时间来初始化
      };
      
      // 脚本加载失败处理
      script.onerror = () => {
        console.error(`MaxKB脚本加载失败 (尝试使用${protocol}协议)`);
        setIsLoading(false);
        setLoadError(true);
        scriptLoaded.current = false;
        
        // 显示更详细的错误信息
        console.error("可能的原因: 跨域问题、MaxKB服务未运行或网络连接问题");
      };
      
      document.body.appendChild(script);
      
      // 清理函数
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);
  
  // 添加开发环境调试信息
  useEffect(() => {
    if (isOpen) {
      console.log("客服窗口状态:", { 
        isOpen, 
        isLoading, 
        loadError, 
        scriptLoaded: scriptLoaded.current,
        currentProtocol: window.location.protocol,
        iframeContainer: document.getElementById(maxKbContainerId)
      });
    }
  }, [isOpen, isLoading, loadError]);
  
  // 重试连接
  const handleRetry = () => {
    scriptLoaded.current = false;
    setLoadError(false);
    setIsLoading(true);
    setShowFallback(false);
    
    // 重新加载脚本 - 会重新触发useEffect
  };
  
  // 使用备用系统
  const handleUseFallback = () => {
    setShowFallback(true);
  };
  
  // 获取当前协议
  const isHttps = window.location.protocol === 'https:';
  
  return (
    <>
      {/* 加载中显示 */}
      {isLoading && <Loading />}
      
      {/* 加载错误显示 */}
      {loadError && !showFallback && (
        <ErrorDisplay 
          onRetry={handleRetry}
          onUseFallback={handleUseFallback}
          isHttps={isHttps}
        />
      )}
      
      {/* MaxKB容器 */}
      <MaxKbContainer 
        containerId={maxKbContainerId}
        isHidden={isLoading || loadError}
      />
      
      {/* 如果加载失败并且用户选择了备用系统，显示备用内容 */}
      {loadError && showFallback && <FallbackContent />}
    </>
  );
};
