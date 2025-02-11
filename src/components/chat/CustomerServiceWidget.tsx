
import React, { useEffect, useCallback, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // 打开客服浮窗的函数
  const openCustomerService = useCallback(() => {
    // 检查全局对象是否存在
    if ((window as any).ChatBoxAPI) {
      (window as any).ChatBoxAPI.open();
    } else {
      toast({
        variant: "destructive",
        title: "客服加载失败",
        description: "正在尝试重新加载客服系统，请稍后再试"
      });
      // 重新加载脚本
      loadScript();
    }
  }, [toast]);

  // 加载脚本的函数
  const loadScript = useCallback(() => {
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = 'http://172.16.20.82:8080/api/application/embed?protocol=http&host=172.16.20.82:8080&token=62bacb3e3b761714';
    script.async = true;
    script.defer = true;

    // 监听脚本加载完成事件
    script.onload = () => {
      console.log('客服脚本加载完成');
      setIsLoading(false);
      toast({
        title: "客服系统已就绪",
        description: "点击按钮即可开始对话"
      });
    };

    // 监听脚本加载失败事件
    script.onerror = () => {
      console.error('客服脚本加载失败');
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "客服系统加载失败",
        description: "请检查网络连接后重试"
      });
    };

    document.body.appendChild(script);

    return () => {
      // 清理脚本
      document.body.removeChild(script);
    };
  }, [toast]);

  useEffect(() => {
    const cleanup = loadScript();
    return cleanup;
  }, [loadScript]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        className={`flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="打开客服"
        onClick={openCustomerService}
        disabled={isLoading}
      >
        <MessageCircle className={`w-6 h-6 ${isLoading ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
};
