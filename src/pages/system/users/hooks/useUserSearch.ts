
import { useState } from 'react';

// 用户搜索钩子
export const useUserSearch = (users: any[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤用户列表
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );

  return { searchQuery, setSearchQuery, filteredUsers };
};
