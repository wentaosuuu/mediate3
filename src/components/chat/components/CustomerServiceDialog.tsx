
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
  const loadAttempts = useRef(0);
  
  // 加载MaxKB客服脚本
  useEffect(() => {
    if (isOpen && !scriptLoaded.current) {
      setIsLoading(true);
      setLoadError(false);
      setShowFallback(false);
      
      // 清除之前可能存在的脚本
      const existingScript = document.getElementById('maxkb-script');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      
      // 清除可能存在的MaxKB相关元素
      const container = document.getElementById(maxKbContainerId);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      
      // 创建新脚本标签
      const script = document.createElement('script');
      script.id = 'maxkb-script';
      
      // 使用新的MaxKB URL
      script.src = `https://maxkb.fit2cloud.com/ui/chat/05b106be72d62386?mode=embed`;
      script.async = true;
      script.defer = true;
      
      // 脚本加载成功处理
      script.onload = () => {
        console.log(`MaxKB脚本加载成功`);
        scriptLoaded.current = true;
        setIsLoading(false);
        loadAttempts.current = 0;
        
        // 检查MaxKB是否在容器中成功初始化
        setTimeout(() => {
          const container = document.getElementById(maxKbContainerId);
          if (container && container.childElementCount === 0) {
            console.log("MaxKB未能成功初始化，可能是混合内容策略问题");
            setLoadError(true);
            scriptLoaded.current = false;
          }
        }, 3000); // 给MaxKB 3秒钟时间来初始化
      };
      
      // 脚本加载失败处理
      script.onerror = () => {
        console.error(`MaxKB脚本加载失败（尝试次数：${loadAttempts.current + 1}）`);
        
        // 如果是第一次尝试，重试一次
        if (loadAttempts.current < 1) {
          loadAttempts.current += 1;
          console.log("正在重试加载MaxKB脚本...");
          setTimeout(() => {
            document.body.appendChild(script);
          }, 1000);
        } else {
          setIsLoading(false);
          setLoadError(true);
          scriptLoaded.current = false;
          loadAttempts.current = 0;
          console.error("多次尝试后MaxKB脚本仍然加载失败");
        }
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
        iframeContainer: document.getElementById(maxKbContainerId),
        maxKbUrl: `https://maxkb.fit2cloud.com/ui/chat/05b106be72d62386?mode=embed`
      });
    }
  }, [isOpen, isLoading, loadError]);
  
  // 重试连接
  const handleRetry = () => {
    scriptLoaded.current = false;
    loadAttempts.current = 0;
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
