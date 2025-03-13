
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  // 初始化客服系统
  useEffect(() => {
    if (scriptLoaded.current) return;
    
    // 重置状态
    setIsLoading(true);
    setError(null);
    
    try {
      // 创建脚本元素
      const script = document.createElement('script');
      script.src = "http://127.0.0.1:8080/api/application/embed?protocol=http&host=127.0.0.1:8080&token=62bacb3e3b761714";
      script.async = true;
      script.defer = true;
      
      // 脚本加载成功的处理
      script.onload = () => {
        console.log("MaxKB脚本已加载");
        scriptLoaded.current = true;
        
        // 给脚本一点时间来初始化
        setTimeout(() => {
          if (window.MaxKB) {
            console.log("MaxKB对象已存在");
            setIsLoaded(true);
            setIsLoading(false);
            
            // 监听关闭事件
            if (typeof window.MaxKB.on === 'function') {
              window.MaxKB.on('close', () => {
                console.log("MaxKB窗口被关闭");
                setIsOpen(false);
              });
            }
          } else {
            console.error("MaxKB对象不存在");
            setError("客服系统加载失败，请刷新页面重试");
            setIsLoading(false);
          }
        }, 1000);
      };
      
      // 脚本加载失败的处理
      script.onerror = (e) => {
        console.error("MaxKB脚本加载失败", e);
        setError("客服系统加载失败，请检查网络连接或联系管理员");
        setIsLoading(false);
      };
      
      // 将脚本添加到文档
      document.body.appendChild(script);
      
      // 设置10秒超时
      const timeoutId = setTimeout(() => {
        if (!isLoaded && isLoading) {
          console.error("MaxKB初始化超时");
          setError("客服系统初始化超时，请刷新页面重试");
          setIsLoading(false);
        }
      }, 10000);
      
      // 清理函数
      return () => {
        clearTimeout(timeoutId);
      };
    } catch (err) {
      console.error("初始化MaxKB时出错:", err);
      setError("初始化客服系统时发生错误");
      setIsLoading(false);
    }
  }, [isLoaded, isLoading]);
  
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
      if (window.MaxKB) {
        if (isOpen) {
          console.log("正在关闭MaxKB窗口");
          window.MaxKB.hide();
        } else {
          console.log("正在打开MaxKB窗口");
          window.MaxKB.show();
        }
        setIsOpen(!isOpen);
      } else {
        console.error("MaxKB对象不存在");
        setError("客服系统未正确初始化");
      }
    } catch (err) {
      console.error("调用客服系统时出错:", err);
      setError("操作客服系统时发生错误");
    }
  };
  
  // 尝试重新加载客服系统
  const handleRetryLoad = () => {
    // 如果有已经加载的脚本，尝试先移除
    const existingScript = document.querySelector('script[src*="api/application/embed"]');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }
    
    // 重置状态
    scriptLoaded.current = false;
    setIsLoaded(false);
    setIsLoading(true);
    setError(null);
    
    // 重新挂载组件，触发useEffect
    toast({
      title: "正在重新加载客服系统",
      description: "请稍候..."
    });
    
    // 给浏览器一点时间来清理
    setTimeout(() => {
      // 创建脚本元素
      const script = document.createElement('script');
      script.src = "http://127.0.0.1:8080/api/application/embed?protocol=http&host=127.0.0.1:8080&token=62bacb3e3b761714";
      script.async = true;
      script.defer = true;
      
      // 添加到文档
      document.body.appendChild(script);
    }, 500);
  };

  return (
    <>
      {/* 为MaxKB准备的容器 */}
      <div ref={embedContainerRef} id="maxkb-container"></div>
      
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
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors ${
            isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-primary hover:bg-primary/90'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isOpen ? "关闭客服" : "打开客服"}
          onClick={toggleCustomerService}
          disabled={!isLoaded || isLoading}
        >
          {isLoading ? (
            <span className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
        
        {/* 加载状态提示 */}
        {isLoading && !error && (
          <span className="absolute -top-6 right-0 text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700 whitespace-nowrap shadow-sm">
            正在加载客服系统...
          </span>
        )}
      </div>
    </>
  );
};
