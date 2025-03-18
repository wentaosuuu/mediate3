
import React from 'react';
import UserHeader from './components/UserHeader';
import UsersContainer from './components/UsersContainer';
import { useUserOperations } from './hooks/useUserOperations';
import { useUserData } from './hooks/useUserData';

/**
 * 用户管理页面组件
 * 整合了用户管理的所有功能
 */
const UsersManagement = () => {
  // 使用自定义钩子获取用户数据方法
  const { refreshAllData } = useUserData();
  
  // 使用自定义钩子处理用户操作，仅获取创建用户方法
  const { openCreateDialog } = useUserOperations(refreshAllData);

  return (
    <div className="p-6">
      {/* 用户管理头部 */}
      <UserHeader onCreateUser={openCreateDialog} />

      {/* 用户管理容器组件 - 已包含表格和弹窗 */}
      <UsersContainer />
    </div>
  );
};

export default UsersManagement;
