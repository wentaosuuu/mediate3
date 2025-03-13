
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

/**
 * 智能客服小部件
 * 
 * 使用Bing.com来演示浮窗效果，不再依赖MaxKB
 */
export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // 切换浮窗显示状态
  const toggleCustomerService = () => {
    setIsOpen(!isOpen);
    
    // 显示一个提示消息
    if (!isOpen) {
      toast({
        title: "已打开客服窗口",
        description: "正在加载Bing.com作为测试内容"
      });
    }
  };

  return (
    <>
      {/* 浮窗内容 */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[70vh] max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* 浮窗标题栏 */}
          <div className="flex items-center justify-between px-4 py-2 bg-primary text-white">
            <h3 className="font-medium">在线客服</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCustomerService}
              className="h-8 w-8 text-white hover:bg-primary/90 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* 浮窗内容区 - 使用iframe加载Bing */}
          <div className="flex-1 overflow-hidden">
            <iframe 
              src="https://www.bing.com" 
              className="w-full h-full border-0"
              title="客服窗口"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}

      {/* 悬浮按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors ${
            isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-primary hover:bg-primary/90'
          } text-white`}
          aria-label={isOpen ? "关闭客服" : "打开客服"}
          onClick={toggleCustomerService}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};
