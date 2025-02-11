
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { CustomerServiceWidget } from './components/chat/CustomerServiceWidget';

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
        </Routes>
        <CustomerServiceWidget />
      </BrowserRouter>
    </>
  );
}

export default App;
