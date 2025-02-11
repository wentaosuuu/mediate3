
import React, { useEffect, useCallback, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // 打开客服浮窗的函数
  const openCustomerService = useCallback(() => {
    // 检查全局对象是否存在
    if ((window as any).ChatBoxAPI) {
      console.log('尝试打开客服窗口');
      try {
        (window as any).ChatBoxAPI.open();
      } catch (error) {
        console.error('打开客服窗口时发生错误:', error);
        toast({
          variant: "destructive",
          title: "客服窗口打开失败",
          description: "请刷新页面后重试"
        });
      }
    } else {
      console.warn('ChatBoxAPI未找到，尝试重新加载');
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
    if (retryCount >= MAX_RETRIES) {
      console.error('达到最大重试次数，停止加载');
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "客服系统暂时不可用",
        description: "请稍后刷新页面重试"
      });
      return;
    }

    setIsLoading(true);
    console.log('开始加载客服脚本，重试次数:', retryCount);

    // 移除可能存在的旧脚本
    const existingScript = document.querySelector('script[data-chatbox]');
    if (existingScript) {
      console.log('移除旧的客服脚本');
      document.body.removeChild(existingScript);
    }

    const script = document.createElement('script');
    script.src = 'http://172.16.20.82:8080/api/application/embed?protocol=http&host=172.16.20.82:8080&token=62bacb3e3b761714';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-chatbox', 'true');

    // 监听脚本加载完成事件
    script.onload = () => {
      console.log('客服脚本加载完成');
      setIsLoading(false);
      setRetryCount(0);
      toast({
        title: "客服系统已就绪",
        description: "点击按钮即可开始对话"
      });
    };

    // 监听脚本加载失败事件
    script.onerror = (error) => {
      console.error('客服脚本加载失败:', error);
      setRetryCount(prev => prev + 1);
      setIsLoading(false);
      
      // 如果还没达到最大重试次数，则延迟重试
      if (retryCount < MAX_RETRIES) {
        console.log(`将在3秒后进行第${retryCount + 1}次重试`);
        setTimeout(() => {
          loadScript();
        }, 3000);
      }
      
      toast({
        variant: "destructive",
        title: "客服系统加载失败",
        description: retryCount < MAX_RETRIES ? "正在尝试重新连接..." : "请检查网络连接后刷新页面重试"
      });
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [retryCount, toast]);

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

