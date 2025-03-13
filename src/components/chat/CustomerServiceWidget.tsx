
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// 声明MaxKB全局变量类型
declare global {
  interface Window {
    MaxKB?: {
      show: () => void;
      hide: () => void;
      on: (event: string, callback: () => void) => void;
      isInitialized?: () => boolean;
    }
  }
}

export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initCheckIntervalRef = useRef<number | null>(null);

  // 加载MaxKB客服脚本
  useEffect(() => {
    // 避免重复加载脚本
    if (scriptRef.current || window.MaxKB) {
      if (window.MaxKB) {
        setIsLoaded(true);
        setError(null);
      }
      return;
    }

    // 创建脚本元素
    const script = document.createElement('script');
    script.src = "http://127.0.0.1:8080/api/application/embed?protocol=http&host=127.0.0.1:8080&token=62bacb3e3b761714";
    script.async = true;
    script.defer = true;
    scriptRef.current = script;

    // 脚本加载成功处理
    script.onload = () => {
      console.log("MaxKB脚本加载成功");
      
      // 设置一个轮询，检查 MaxKB 是否真正初始化完成
      if (initCheckIntervalRef.current === null) {
        initCheckIntervalRef.current = window.setInterval(() => {
          if (window.MaxKB && typeof window.MaxKB.show === 'function') {
            console.log("MaxKB 客服系统初始化完成");
            clearInterval(initCheckIntervalRef.current as number);
            initCheckIntervalRef.current = null;
            
            setIsLoaded(true);
            setError(null);
            
            // 监听MaxKB的事件
            window.MaxKB.on('close', () => {
              setIsOpen(false);
            });
          }
        }, 500);
      }
      
      // 设置30秒超时，如果MaxKB没有初始化，显示错误
      setTimeout(() => {
        if (!isLoaded && initCheckIntervalRef.current !== null) {
          clearInterval(initCheckIntervalRef.current);
          initCheckIntervalRef.current = null;
          setError("客服系统初始化超时，请刷新页面重试");
        }
      }, 30000);
    };

    // 脚本加载失败处理
    script.onerror = () => {
      console.error("MaxKB脚本加载失败");
      setError("客服系统加载失败，请检查网络连接或联系管理员");
      setIsLoaded(false);
    };

    // 将脚本添加到文档
    document.body.appendChild(script);

    // 清理函数
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
      
      if (initCheckIntervalRef.current !== null) {
        clearInterval(initCheckIntervalRef.current);
        initCheckIntervalRef.current = null;
      }
    };
  }, [isLoaded]);

  // 切换客服窗口显示状态
  const toggleCustomerService = () => {
    if (!isLoaded) {
      toast({
        variant: "destructive",
        title: "客服系统尚未准备就绪",
        description: "请稍后再试或刷新页面"
      });
      return;
    }

    try {
      if (window.MaxKB && typeof window.MaxKB.show === 'function' && typeof window.MaxKB.hide === 'function') {
        if (isOpen) {
          window.MaxKB.hide();
        } else {
          window.MaxKB.show();
        }
        setIsOpen(!isOpen);
      } else {
        console.error("MaxKB 客服系统未正确初始化");
        setError("客服系统未正确初始化，请刷新页面重试");
      }
    } catch (err) {
      console.error("调用客服系统时出错:", err);
      setError("客服系统出现异常，请刷新页面重试");
    }
  };

  // 尝试重新加载客服系统
  const handleRetryLoad = () => {
    setError(null);
    
    // 移除旧脚本
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
    }
    
    scriptRef.current = null;
    setIsLoaded(false);
    
    // 重新触发useEffect
    const reloadScript = document.createElement('script');
    reloadScript.src = "http://127.0.0.1:8080/api/application/embed?protocol=http&host=127.0.0.1:8080&token=62bacb3e3b761714";
    reloadScript.async = true;
    reloadScript.defer = true;
    scriptRef.current = reloadScript;
    document.body.appendChild(reloadScript);
    
    toast({
      title: "正在重新加载客服系统",
      description: "请稍候..."
    });
  };

  return (
    <>
      {/* 错误提示 */}
      {error && (
        <div className="fixed bottom-20 right-6 z-50 w-72">
          <Alert variant="destructive" className="flex flex-col gap-2">
            <AlertDescription className="text-sm">{error}</AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryLoad}
              className="self-end mt-1"
            >
              重新加载
            </Button>
          </Alert>
        </div>
      )}

      {/* 悬浮按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isOpen ? "关闭客服" : "打开客服"}
          onClick={toggleCustomerService}
          disabled={!isLoaded}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        {!isLoaded && !error && (
          <span className="absolute -top-6 right-0 text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700 whitespace-nowrap">
            正在加载...
          </span>
        )}
      </div>
    </>
  );
};
