
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 当组件加载时，添加客服脚本
    const script = document.createElement('script');
    script.src = 'http://172.16.20.40:8080/api/application/embed?protocol=http&host=172.16.20.40:8080&token=62bacb3e3b761714';
    script.async = true;
    script.defer = true;
    
    // 监听脚本加载和初始化状态
    const checkMaxKBInitialized = () => {
      if ((window as any).MaxKB) {
        setScriptLoaded(true);
        console.log('客服脚本初始化成功');
      } else {
        // 如果还没初始化完成，继续等待
        setTimeout(checkMaxKBInitialized, 100);
      }
    };

    script.onload = () => {
      console.log('客服脚本加载成功，等待初始化...');
      checkMaxKBInitialized();
    };

    script.onerror = () => {
      toast({
        variant: "destructive",
        title: "客服系统加载失败",
        description: "请检查网络连接后重试"
      });
    };

    document.body.appendChild(script);

    // 清理函数
    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  // 切换客服窗口显示状态
  const toggleCustomerService = () => {
    if (!scriptLoaded) {
      toast({
        title: "客服系统正在加载",
        description: "请稍候再试"
      });
      return;
    }

    if ((window as any).MaxKB) {
      try {
        console.log('切换客服窗口状态，当前状态:', !isOpen);
        (window as any).MaxKB.toggle();
        setIsOpen(!isOpen);
      } catch (error) {
        console.error('切换客服窗口失败:', error);
        toast({
          variant: "destructive",
          title: "操作失败",
          description: "客服系统出现异常"
        });
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label={isOpen ? "关闭客服" : "打开客服"}
        onClick={toggleCustomerService}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};
