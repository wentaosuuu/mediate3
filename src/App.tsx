
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseDistribution from './pages/case/CaseDistribution';
import MediationCenter from './pages/mediation/MediationCenter';
import SmsService from './pages/mediation/SmsService';
import SmsRecords from './pages/mediation/SmsRecords';
import DepartmentQuota from './pages/quota/DepartmentQuota';
import StaffQuota from './pages/quota/StaffQuota';
import Statistics from './pages/quota/Statistics';
import Balance from './pages/wallet/Balance';
import Orders from './pages/wallet/Orders';
import Purchase from './pages/wallet/Purchase';
import Quota from './pages/wallet/Quota';
import UsersManagement from './pages/system/Users';
import RolesManagement from './pages/system/Roles';
import DepartmentsManagement from './pages/system/Departments';
import { CustomerServiceWidget } from './components/chat/CustomerServiceWidget';
import NotFound from './components/NotFound';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case/distribution" element={<CaseDistribution />} />
        <Route path="/mediation/center" element={<MediationCenter />} />
        <Route path="/mediation/sms" element={<SmsService />} />
        <Route path="/mediation/sms-records" element={<SmsRecords />} />
        <Route path="/quota/department" element={<DepartmentQuota />} />
        <Route path="/quota/staff" element={<StaffQuota />} />
        <Route path="/quota/statistics" element={<Statistics />} />
        <Route path="/wallet/balance" element={<Balance />} />
        <Route path="/wallet/orders" element={<Orders />} />
        <Route path="/wallet/purchase" element={<Purchase />} />
        <Route path="/wallet/quota" element={<Quota />} />
        {/* 系统管理路由 */}
        <Route path="/system/users" element={<UsersManagement />} />
        <Route path="/system/roles" element={<RolesManagement />} />
        <Route path="/system/departments" element={<DepartmentsManagement />} />
        
        {/* 未开发页面路由 - 系统管理 */}
        <Route path="/system/menus" element={<UnderDevelopmentPage title="菜单管理" />} />
        <Route path="/system/positions" element={<UnderDevelopmentPage title="岗位管理" />} />
        <Route path="/system/dictionaries" element={<UnderDevelopmentPage title="字典管理" />} />
        <Route path="/system/parameters" element={<UnderDevelopmentPage title="参数设置" />} />
        <Route path="/system/notifications" element={<UnderDevelopmentPage title="通知公告" />} />
        <Route path="/system/logs" element={<UnderDevelopmentPage title="日志管理" />} />
        <Route path="/system/files" element={<UnderDevelopmentPage title="文件管理" />} />
        <Route path="/system/clients" element={<UnderDevelopmentPage title="客户端管理" />} />
        
        {/* 未开发页面路由 - 案件管理 */}
        <Route path="/case/*" element={<UnderDevelopmentPage title="案件管理" />} />
        
        {/* 未开发页面路由 - 调解管理 */}
        <Route path="/mediation/debtor" element={<UnderDevelopmentPage title="债务人管理" />} />
        <Route path="/mediation/case-info" element={<UnderDevelopmentPage title="案件公示信息" />} />
        <Route path="/mediation/case-info-manage" element={<UnderDevelopmentPage title="案件公示信息管理" />} />
        
        {/* 未开发页面路由 - 数据看板 */}
        <Route path="/dashboard-stats/*" element={<UnderDevelopmentPage title="数据看板" />} />
        
        {/* 未开发页面路由 - 短信管理 */}
        <Route path="/sms/*" element={<UnderDevelopmentPage title="短信管理" />} />
        
        {/* 未开发页面路由 - 呼叫中心 */}
        <Route path="/call-center/*" element={<UnderDevelopmentPage title="呼叫中心" />} />
        
        {/* 未开发页面路由 - 调解记录 */}
        <Route path="/mediation-records/*" element={<UnderDevelopmentPage title="调解记录" />} />
        
        {/* 未开发页面路由 - 运营中心 */}
        <Route path="/operation/*" element={<UnderDevelopmentPage title="运营中心" />} />
        
        {/* 未开发页面路由 - 租户管理 */}
        <Route path="/tenant/*" element={<UnderDevelopmentPage title="租户管理" />} />
        
        {/* 未开发页面路由 - 账户中心 */}
        <Route path="/account/*" element={<UnderDevelopmentPage title="账户中心" />} />
        
        {/* 未开发页面路由 - 全局管理 */}
        <Route path="/global/*" element={<UnderDevelopmentPage title="全局管理" />} />
      </Routes>
      <CustomerServiceWidget />
    </>
  );
}

// 开发中页面组件
const UnderDevelopmentPage = ({ title }: { title: string }) => {
  // 使用useUserInfo钩子获取用户信息
  const { userInfo, handleLogout, isInitialized, isLoading } = useUserInfo();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("UnderDevelopmentPage - 当前用户信息:", userInfo);
  }, [userInfo]);

  const onNavigate = (path: string) => {
    navigate(path);
  };

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/');
    }
  };

  // 等待用户信息初始化完成
  if (!isInitialized || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">加载用户信息中...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={window.location.pathname}
          onMenuClick={(path) => onNavigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={userInfo.username}
          department={userInfo.department}
          role={userInfo.role}
          onLogout={onLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={userInfo.username} currentPath={window.location.pathname}>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2 text-gray-700">{title}</h1>
              <NotFound />
            </div>
          </div>
        </MainContent>
      </div>
    </div>
  );
};

export default App;
