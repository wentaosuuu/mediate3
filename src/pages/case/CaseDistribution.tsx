import React from 'react';
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
  const [searchParams, setSearchParams] = React.useState<SearchParams>({});

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

  const handleSearch = (values: SearchParams) => {
    setSearchParams(values);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">分案管理</h1>
      <CaseSearchForm onSearch={handleSearch} onReset={handleReset} />
      <CaseTable data={cases} isLoading={isLoading} />
    </div>
  );
};

export default CaseDistribution;