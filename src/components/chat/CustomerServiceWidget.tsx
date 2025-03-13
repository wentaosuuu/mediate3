
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogClose
} from "@/components/ui/dialog";

/**
 * 智能客服小部件
 * 
 * 使用MaxKB作为客服系统，通过动态加载脚本的方式实现
 */
export const CustomerServiceWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const scriptLoaded = useRef(false);
  const maxKbContainerId = "maxkb-container";

  // 加载MaxKB客服脚本
  useEffect(() => {
    if (isOpen && !scriptLoaded.current) {
      setIsLoading(true);
      setLoadError(false);
      
      const script = document.createElement('script');
      // 使用相对协议（省略http:），让浏览器自动匹配当前页面的协议
      script.src = "//127.0.0.1:8080/api/application/embed?protocol=http&host=127.0.0.1:8080&token=62bacb3e3b761714";
      script.async = true;
      script.defer = true;
      
      // 脚本加载成功处理
      script.onload = () => {
        console.log("MaxKB脚本加载成功");
        scriptLoaded.current = true;
        setIsLoading(false);
        
        // 检查MaxKB是否在容器中成功初始化
        setTimeout(() => {
          const container = document.getElementById(maxKbContainerId);
          if (container && container.childElementCount === 0) {
            console.log("MaxKB未能成功初始化，可能是连接问题");
            setLoadError(true);
          }
        }, 3000); // 给MaxKB 3秒钟时间来初始化
      };
      
      // 脚本加载失败处理
      script.onerror = () => {
        console.error("MaxKB脚本加载失败");
        setIsLoading(false);
        setLoadError(true);
        scriptLoaded.current = false;
        
        // 显示更详细的错误信息
        console.error("可能的原因: 跨域问题、MaxKB服务未运行或网络连接问题");
      };
      
      document.body.appendChild(script);
      
      // 清理函数
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  // 添加开发环境调试信息
  useEffect(() => {
    if (isOpen) {
      console.log("客服窗口状态:", { 
        isOpen, 
        isLoading, 
        loadError, 
        scriptLoaded: scriptLoaded.current,
        currentProtocol: window.location.protocol,
        iframeContainer: document.getElementById(maxKbContainerId)
      });
    }
  }, [isOpen, isLoading, loadError]);

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

  // 显示备用内容（Bing页面）
  const showFallbackContent = () => {
    return (
      <div className="flex-1 overflow-hidden">
        <iframe 
          src="https://www.bing.com" 
          className="w-full h-full border-0"
          title="备用客服窗口"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    );
  };

  return (
    <>
      {/* 使用Dialog来显示客服窗口 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {isOpen && (
          <DialogPortal>
            <DialogContent className="fixed bottom-20 right-6 sm:max-w-[425px] w-96 h-[70vh] max-h-[600px] p-0">
              {/* 浮窗标题栏 */}
              <div className="flex items-center justify-between px-4 py-2 bg-primary text-white">
                <h3 className="font-medium">在线客服</h3>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-primary/90 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </DialogClose>
              </div>
              
              {/* 客服内容区 */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* 加载中显示 */}
                {isLoading && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">加载中...</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">正在连接客服系统...</p>
                    </div>
                  </div>
                )}
                
                {/* 加载错误显示 */}
                {loadError && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-red-500 mb-4">客服系统连接失败</p>
                      <p className="mb-4 text-sm text-gray-500">
                        可能是由于MaxKB服务未启动、网络问题或跨域限制导致
                        {window.location.protocol === 'https:' && 
                          <span className="block mt-1 text-amber-600">
                            检测到您正在使用HTTPS，而MaxKB使用HTTP，这可能导致浏览器阻止加载
                          </span>
                        }
                      </p>
                      <Button 
                        onClick={() => {
                          scriptLoaded.current = false;
                          setLoadError(false);
                          setIsLoading(true);
                          
                          // 重新加载脚本
                          const script = document.createElement('script');
                          script.src = "//127.0.0.1:8080/api/application/embed?protocol=http&host=127.0.0.1:8080&token=62bacb3e3b761714";
                          script.async = true;
                          script.defer = true;
                          document.body.appendChild(script);
                        }}
                        variant="outline"
                        className="mr-2"
                      >
                        重试连接
                      </Button>
                      <Button 
                        onClick={() => showFallbackContent()}
                        variant="default"
                      >
                        使用备用系统
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* MaxKB容器 */}
                <div 
                  id={maxKbContainerId} 
                  className={`flex-1 w-full ${isLoading || loadError ? 'hidden' : ''}`}
                ></div>
                
                {/* 如果加载失败并且用户选择了备用系统，显示备用内容 */}
                {loadError && !isLoading && (
                  <div className="absolute inset-0 pt-12">
                    {showFallbackContent()}
                  </div>
                )}
              </div>
            </DialogContent>
          </DialogPortal>
        )}
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
