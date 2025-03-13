
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './pages/Index';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseDistribution from './pages/case/CaseDistribution';
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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/case/distribution" element={<CaseDistribution />} />
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
          <Route path="/mediation/center" element={<UnderDevelopmentPage title="调解中心" />} />
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
      </BrowserRouter>
    </>
  );
}

// 开发中页面组件
const UnderDevelopmentPage = ({ title }: { title: string }) => {
  // Mock user data - 实际项目中应该从认证系统获取
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };
  
  const navigate = (path: string) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath={window.location.pathname}
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={mockUser.username} currentPath={window.location.pathname}>
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
