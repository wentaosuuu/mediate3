
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // 切换客服窗口显示状态
  const toggleCustomerService = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label={isOpen ? "关闭客服" : "打开客服"}
          onClick={toggleCustomerService}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* 客服对话框 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[600px] bg-white rounded-lg shadow-xl">
          {/* 顶部栏 */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white rounded-t-lg">
            <h3 className="font-medium">在线客服</h3>
            <button
              onClick={toggleCustomerService}
              className="p-1 hover:bg-primary/80 rounded-full transition-colors"
              aria-label="关闭客服窗口"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 客服iframe */}
          <iframe
            src="http://172.16.20.40:8080/api/application/embed?protocol=http&host=172.16.20.40:8080&token=62bacb3e3b761714"
            className="w-full h-[calc(100%-48px)]"
            style={{ border: 'none' }}
            title="客服系统"
            onError={() => {
              toast({
                variant: "destructive",
                title: "客服系统加载失败",
                description: "请检查网络连接后重试"
              });
            }}
          />
        </div>
      )}
    </>
  );
};
