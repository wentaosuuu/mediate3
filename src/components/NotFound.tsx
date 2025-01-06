import React from 'react';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <FileQuestion className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">页面未找到</h1>
      <p className="text-gray-500">抱歉，您访问的页面不存在或正在开发中。</p>
    </div>
  );
};

export default NotFound;