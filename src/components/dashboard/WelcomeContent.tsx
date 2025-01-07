import React from 'react';
import { Home } from 'lucide-react';

interface WelcomeContentProps {
  username: string | null;
}

export const WelcomeContent = ({ username }: WelcomeContentProps) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Home className="h-6 w-6 text-primary" />
      <h1 className="text-2xl font-semibold text-gray-900">
        欢迎回来, {username || '用户'}
      </h1>
    </div>
  );
};