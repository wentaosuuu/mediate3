
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 声明MaxKB全局变量类型
declare global {
  interface Window {
    MaxKB?: {
      show: () => void;
      hide: () => void;
      on: (event: string, callback: () => void) => void;
    }
  }
}

export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // 加载MaxKB客服脚本
  useEffect(() => {
    // 避免重复加载脚本
    if (scriptRef.current || window.MaxKB) {
      setIsLoaded(true);
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
      setIsLoaded(true);
      setError(null);
      
      // 监听MaxKB的事件（如果需要）
      if (window.MaxKB) {
        window.MaxKB.on('close', () => {
          setIsOpen(false);
        });
      }
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
    };
  }, []);

  // 切换客服窗口显示状态
  const toggleCustomerService = () => {
    if (!isLoaded || !window.MaxKB) {
      toast({
        variant: "destructive",
        title: "客服系统尚未准备就绪",
        description: "请稍后再试或刷新页面"
      });
      return;
    }

    if (isOpen) {
      window.MaxKB.hide();
    } else {
      window.MaxKB.show();
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 错误提示 */}
      {error && (
        <div className="fixed bottom-20 right-6 z-50 w-64">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* 悬浮按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label={isOpen ? "关闭客服" : "打开客服"}
          onClick={toggleCustomerService}
          disabled={!isLoaded}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        {!isLoaded && (
          <span className="absolute -top-6 right-0 text-xs text-gray-500">
            正在加载...
          </span>
        )}
      </div>
    </>
  );
};
