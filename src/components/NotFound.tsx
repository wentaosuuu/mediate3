
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <FileQuestion className="w-20 h-20 mb-4 text-blue-400" />
      <h2 className="text-2xl font-semibold mb-2 text-gray-700">页面开发中</h2>
      <p className="text-gray-500 mb-6 text-center">该功能正在开发中，敬请期待</p>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-700">温馨提示</AlertTitle>
        <AlertDescription className="text-blue-600">
          我们的技术团队正在加紧开发此功能，预计将很快上线。感谢您的理解与支持！
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotFound;
