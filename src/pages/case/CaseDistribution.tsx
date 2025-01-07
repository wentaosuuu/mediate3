import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';

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
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/case/distribution"
          onMenuClick={handleMenuClick}
        />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar
            username={mockUser.username}
            department={mockUser.department}
            role={mockUser.role}
            onLogout={handleLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </div>
        <div className="mt-16 p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">分案管理</h1>
            <CaseSearchForm onSearch={handleSearchCases} onReset={handleReset} />
            <CaseTable data={cases} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDistribution;