
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { CustomerServiceDialog } from './components/CustomerServiceDialog';

/**
 * 智能客服小部件
 * 
 * 使用MaxKB作为客服系统，通过动态加载脚本的方式实现
 */
export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // 切换客服窗口显示状态
  const toggleCustomerService = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      toast({
        title: "已打开客服窗口",
        description: "正在加载MaxKB客服系统..."
      });
    }
  };

  return (
    <>
      {/* 使用Dialog来显示客服窗口 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CustomerServiceDialog 
          isOpen={isOpen} 
          onOpenChange={setIsOpen} 
        />
      </Dialog>

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
