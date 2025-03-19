
import { useState, useMemo } from 'react';

/**
 * 角色搜索钩子
 * 负责处理角色的搜索和过滤功能
 */
export const useRoleSearch = (roles: any[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤角色列表
  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [roles, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredRoles
  };
};
