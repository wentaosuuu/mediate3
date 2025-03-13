
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface RolesSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// 角色搜索组件
const RolesSearch = ({ searchQuery, setSearchQuery }: RolesSearchProps) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="搜索角色名称或描述"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RolesSearch;
