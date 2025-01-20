import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Balance from './pages/quota/Balance';
import Purchase from './pages/quota/Purchase';
import Orders from './pages/quota/Orders';
import CaseManagement from './pages/case/CaseManagement';
import AccountManage from './pages/account/AccountManage';
import Consumption from './pages/account/Consumption';
import Recharge from './pages/account/Recharge';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="/quota/balance" element={<Balance />} />
            <Route path="/quota/purchase" element={<Purchase />} />
            <Route path="/quota/orders" element={<Orders />} />
            <Route path="/case" element={<CaseManagement />} />
            <Route path="/mediation" element={<div>调解管理页面</div>} />
            <Route path="/dashboard-stats" element={<div>仪表盘页面</div>} />
            <Route path="/sms" element={<div>短信管理页面</div>} />
            <Route path="/call-center" element={<div>呼叫中心页面</div>} />
            <Route path="/mediation-records" element={<div>调解记录页面</div>} />
            <Route path="/operation" element={<div>运营中心页面</div>} />
            <Route path="/tenant" element={<div>租户管理页面</div>} />
            <Route path="/account/manage" element={<AccountManage />} />
            <Route path="/account/consumption" element={<Consumption />} />
            <Route path="/account/recharge" element={<Recharge />} />
            <Route path="/system" element={<div>系统管理页面</div>} />
            <Route path="/global" element={<div>全局管理页面</div>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;