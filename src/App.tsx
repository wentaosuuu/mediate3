import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseDistribution from './pages/case/CaseDistribution';
import SmsService from './pages/mediation/SmsService';
import SmsRecords from './pages/mediation/SmsRecords';
import Balance from './pages/wallet/Balance';
import Orders from './pages/wallet/Orders';
import Purchase from './pages/wallet/Purchase';
import Quota from './pages/wallet/Quota';
import DepartmentQuota from './pages/quota/DepartmentQuota';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="case/distribution" element={<CaseDistribution />} />
          <Route path="mediation/sms" element={<SmsService />} />
          <Route path="mediation/sms-records" element={<SmsRecords />} />
          <Route path="wallet/balance" element={<Balance />} />
          <Route path="wallet/orders" element={<Orders />} />
          <Route path="wallet/purchase" element={<Purchase />} />
          <Route path="wallet/quota" element={<Quota />} />
          <Route path="quota/department" element={<DepartmentQuota />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;