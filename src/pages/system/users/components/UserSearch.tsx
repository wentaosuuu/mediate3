
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// 用户搜索组件
const UserSearch = ({ searchQuery, setSearchQuery }: UserSearchProps) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="搜索用户名、邮箱或电话"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
