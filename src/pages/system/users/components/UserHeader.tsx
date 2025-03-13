
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 用户管理头部组件
interface UserHeaderProps {
  onCreateUser: () => void;
}

const UserHeader = ({ onCreateUser }: UserHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">用户管理</h1>
      <Button onClick={onCreateUser}>
        <UserPlus className="mr-2 h-4 w-4" />
        创建用户
      </Button>
    </div>
  );
};

export default UserHeader;
