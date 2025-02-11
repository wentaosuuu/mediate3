
import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export const CustomerServiceWidget = () => {
  useEffect(() => {
    // 添加客服脚本
    const script = document.createElement('script');
    script.src = 'http://172.16.20.82:8080/api/application/embed?protocol=http&host=172.16.20.82:8080&token=fabcdcc489bf1db0';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // 清理脚本
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="打开客服"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};
