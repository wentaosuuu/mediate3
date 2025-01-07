import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CaseDistribution from "./pages/case/CaseDistribution";
import NotFound from "./components/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* 案件管理路由 */}
          <Route path="/case/distribution" element={<CaseDistribution />} />
          <Route path="/mediation/center" element={<NotFound />} />
          <Route path="/mediation/debtor" element={<NotFound />} />
          <Route path="/mediation/case-info" element={<NotFound />} />
          <Route path="/mediation/case-info-manage" element={<NotFound />} />
          {/* 仪表盘路由 */}
          <Route path="/dashboard-stats/sms" element={<NotFound />} />
          <Route path="/dashboard-stats/communication" element={<NotFound />} />
          {/* 短信管理路由 */}
          <Route path="/sms/type-config" element={<NotFound />} />
          <Route path="/sms/template-config" element={<NotFound />} />
          {/* 呼叫中心路由 */}
          <Route path="/call-center/caller" element={<NotFound />} />
          <Route path="/call-center/seat" element={<NotFound />} />
          <Route path="/call-center/work-number-seat" element={<NotFound />} />
          <Route path="/call-center/work-number" element={<NotFound />} />
          <Route path="/call-center/virtual-number" element={<NotFound />} />
          <Route path="/call-center/credit-seat" element={<NotFound />} />
          {/* 调解记录路由 */}
          <Route path="/mediation-records/repair-batch" element={<NotFound />} />
          <Route path="/mediation-records/credit-call" element={<NotFound />} />
          <Route path="/mediation-records/repair" element={<NotFound />} />
          <Route path="/mediation-records/call" element={<NotFound />} />
          <Route path="/mediation-records/sms-batch" element={<NotFound />} />
          <Route path="/mediation-records/sms" element={<NotFound />} />
          {/* 运营中心路由 */}
          <Route path="/operation/privacy" element={<NotFound />} />
          <Route path="/operation/sms-reach" element={<NotFound />} />
          {/* 租户管理路由 */}
          <Route path="/tenant/manage" element={<NotFound />} />
          <Route path="/tenant/package" element={<NotFound />} />
          {/* 账户中心路由 */}
          <Route path="/account/manage" element={<NotFound />} />
          <Route path="/account/consumption" element={<NotFound />} />
          <Route path="/account/recharge" element={<NotFound />} />
          {/* 系统管理路由 */}
          <Route path="/system/users" element={<NotFound />} />
          <Route path="/system/roles" element={<NotFound />} />
          <Route path="/system/menus" element={<NotFound />} />
          <Route path="/system/departments" element={<NotFound />} />
          <Route path="/system/positions" element={<NotFound />} />
          <Route path="/system/dictionaries" element={<NotFound />} />
          <Route path="/system/parameters" element={<NotFound />} />
          <Route path="/system/notifications" element={<NotFound />} />
          <Route path="/system/logs" element={<NotFound />} />
          <Route path="/system/files" element={<NotFound />} />
          <Route path="/system/clients" element={<NotFound />} />
          {/* 全局管理路由 */}
          <Route path="/global" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
