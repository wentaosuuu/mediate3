import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center justify-center w-full gap-3">
      <img
        src="/lovable-uploads/4b6c2cac-5597-4e26-bfde-a2902643b26a.png"
        alt="Logo"
        className="h-8 w-auto object-contain"
      />
      <span className="text-white text-lg font-medium whitespace-nowrap">
        法调云3.0
      </span>
    </div>
  );
};