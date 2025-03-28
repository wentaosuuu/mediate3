
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { CustomerServiceDialog } from './components/CustomerServiceDialog';
import { Button } from "@/components/ui/button";

/**
 * 智能客服小部件
 * 
 * 使用MaxKB作为客服系统，通过代理解决HTTP/HTTPS混合内容问题
 */
export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // 切换客服窗口显示状态
  const toggleCustomerService = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      // 检测当前环境
      const protocol = window.location.protocol;
      const host = window.location.host;
      
      console.log(`当前环境：${protocol}//${host}`);
      console.log(`尝试通过代理加载MaxKB：/maxkb-api/...`);
      
      toast({
        title: "已打开客服窗口",
        description: "正在加载MaxKB客服系统..."
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 浮窗客服窗口 */}
      {isOpen && (
        <div className="mb-4 w-96 h-[70vh] max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in">
          {/* 浮窗标题栏 */}
          <div className="flex items-center justify-between px-4 py-2 bg-primary text-white">
            <h3 className="font-medium text-white">在线客服</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-primary/90 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* 客服内容区 */}
          <div className="flex-1 overflow-hidden">
            <CustomerServiceDialog isOpen={isOpen} onOpenChange={setIsOpen} />
          </div>
        </div>
      )}

      {/* 悬浮按钮 */}
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
  );
};
