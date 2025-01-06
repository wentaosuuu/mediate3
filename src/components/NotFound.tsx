import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <FileQuestion className="w-16 h-16 mb-4 text-gray-400" />
      <h2 className="text-xl font-semibold mb-2 text-gray-700">页面开发中</h2>
      <p className="text-gray-500">该功能正在开发中，敬请期待</p>
    </div>
  );
};

export default NotFound;