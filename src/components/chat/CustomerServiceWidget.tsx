
import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
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
    script.onload = () => {
      setScriptLoaded(true);
      console.log('客服脚本加载成功');
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
    setIsOpen(!isOpen);
    // 如果脚本已加载，通过全局方法控制显示/隐藏
    if (scriptLoaded && (window as any).MaxKB) {
      if (!isOpen) {
        (window as any).MaxKB.toggle();
      } else {
        (window as any).MaxKB.hide();
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
