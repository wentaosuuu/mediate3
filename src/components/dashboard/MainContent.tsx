import React from 'react';
import { Home } from 'lucide-react';
import NotFound from '@/components/NotFound';

interface MainContentProps {
  username: string | null;
  currentPath: string;
}

export const MainContent = ({ username, currentPath }: MainContentProps) => {
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {currentPath === '/dashboard' ? (
          <div className="flex items-center gap-2 mb-6">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">
              欢迎回来, {username || '用户'}
            </h1>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </main>
  );
};