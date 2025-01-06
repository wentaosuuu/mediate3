import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <FileQuestion className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold mb-2">页面开发中</h2>
      <p>该功能正在开发中，敬请期待</p>
    </div>
  );
};

export default NotFound;