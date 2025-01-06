import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <img
        src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
        alt="404 Cat"
        className="w-64 h-64 object-cover rounded-full mb-8"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">页面正在开发中...</h1>
      <p className="text-gray-600 text-center">
        抱歉，您访问的页面正在建设中，请稍后再试。
      </p>
    </div>
  );
};

export default NotFound;