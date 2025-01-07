import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';
import { CaseStatusTabs } from '@/components/case/CaseStatusTabs';
import { DepartmentSidebar } from '@/components/case/DepartmentSidebar';
import { PageTabs } from '@/components/dashboard/PageTabs';

interface SearchParams {
  caseNumber?: string;
  batchNumber?: string;
  borrowerNumber?: string;
  idNumber?: string;
  customerName?: string;
  phone?: string;
  productLine?: string;
  receiver?: string;
  adjuster?: string;
  distributor?: string;
  progressStatus?: string;
  startTime?: string;
  endTime?: string;
}

const CaseDistribution = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('1-1');
  const [caseStatus, setCaseStatus] = useState('pending');

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchCases = (params: SearchParams) => {
    setSearchParams(params);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleAddCase = () => {
    // Handle add case
  };

  const handleImportCases = () => {
    // Handle import cases
  };

  const handleExportCases = () => {
    // Handle export cases
  };

  // Mock user data
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  const mockTabs = [
    { path: '/case/distribution', label: '分案管理', closeable: false },
    { path: '/case/follow-up', label: '案件跟进', closeable: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 左侧固定导航栏 */}
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/case/distribution"
          onMenuClick={handleMenuClick}
        />
      </div>

      {/* 右侧内容区域 */}
      <div className="pl-64 min-h-screen">
        {/* 顶部固定导航栏 */}
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar
            username={mockUser.username}
            department={mockUser.department}
            role={mockUser.role}
            onLogout={handleLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
          <PageTabs
            tabs={mockTabs}
            currentPath="/case/distribution"
            onClose={(path) => console.log('close tab:', path)}
            onTabClick={(path) => navigate(path)}
          />
        </div>

        {/* 主要内容区域 */}
        <div className="pt-28 px-6">
          <div className="mb-4">
            <CaseStatusTabs value={caseStatus} onValueChange={setCaseStatus} />
          </div>
          <div className="flex">
            <DepartmentSidebar
              selectedDepartment={selectedDepartment}
              onDepartmentSelect={setSelectedDepartment}
            />
            <div className="flex-1 space-y-4">
              <CaseSearchForm
                onSearch={handleSearchCases}
                onReset={handleReset}
                onAddCase={handleAddCase}
                onImportCases={handleImportCases}
                onExportCases={handleExportCases}
              />
              <CaseTable data={cases} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDistribution;