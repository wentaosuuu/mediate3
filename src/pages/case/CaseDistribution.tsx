import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';
import { toast } from 'sonner';

interface SearchParams {
  caseNumber?: string;
  batchNumber?: string;
  borrowerNumber?: string;
  idNumber?: string;
  customerName?: string;
  phone?: string;
}

const CaseDistribution = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  // Mock user data - replace with actual user data later
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases', searchParams],
    queryFn: async () => {
      let query = supabase
        .from('cases')
        .select('*');

      if (searchParams.caseNumber) {
        query = query.ilike('case_number', `%${searchParams.caseNumber}%`);
      }
      if (searchParams.batchNumber) {
        query = query.ilike('batch_number', `%${searchParams.batchNumber}%`);
      }
      if (searchParams.borrowerNumber) {
        query = query.ilike('borrower_number', `%${searchParams.borrowerNumber}%`);
      }
      if (searchParams.idNumber) {
        query = query.ilike('id_number', `%${searchParams.idNumber}%`);
      }
      if (searchParams.customerName) {
        query = query.ilike('customer_name', `%${searchParams.customerName}%`);
      }
      if (searchParams.phone) {
        query = query.ilike('phone', `%${searchParams.phone}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast.error('获取案件数据失败');
        throw error;
      }

      return data;
    },
  });

  const handleSearchCases = (values: SearchParams) => {
    setSearchParams(values);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-gray-100">
        <Navigation
          currentPath="/case/distribution"
          onMenuClick={handleMenuClick}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar
            username={mockUser.username}
            department={mockUser.department}
            role={mockUser.role}
            onLogout={handleLogout}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-semibold text-gray-900">分案管理</h1>
            <CaseSearchForm onSearch={handleSearchCases} onReset={handleReset} />
            <CaseTable data={cases} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CaseDistribution;