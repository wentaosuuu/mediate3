import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';
import { CaseStatusTabs } from '@/components/case/CaseStatusTabs';
import { DepartmentSidebar } from '@/components/case/DepartmentSidebar';
import { MainContent } from '@/components/dashboard/MainContent';

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/case/distribution"
          onMenuClick={handleMenuClick}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <MainContent username={mockUser.username} currentPath="/case/distribution">
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
        </MainContent>
      </div>
    </div>
  );
};

export default CaseDistribution;