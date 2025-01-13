import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
import { SmsRecordsSearchForm } from '@/components/sms-records/SmsRecordsSearchForm';
import { SmsRecordsTable } from '@/components/sms-records/SmsRecordsTable';
import { supabase } from '@/integrations/supabase/client';
import type { SmsSearchParams, SmsRecord } from '@/types/sms';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZE = 10;

const SmsRecords = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchParams, setSearchParams] = React.useState<SmsSearchParams>({});

  // Mock user data - 实际项目中应该从认证系统获取
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const fetchSmsRecords = async ({ page, params }: { page: number, params: SmsSearchParams }) => {
    let query = supabase
      .from('sms_records')
      .select('*', { count: 'exact' });

    // 添加搜索条件
    if (params.content) {
      query = query.ilike('content', `%${params.content}%`);
    }
    if (params.customerInfo) {
      query = query.contains('recipients', [params.customerInfo]);
    }
    if (params.smsType) {
      query = query.eq('sms_type', params.smsType);
    }
    if (params.status) {
      query = query.eq('status', params.status);
    }
    if (params.startTime) {
      query = query.gte('send_time', params.startTime);
    }
    if (params.endTime) {
      query = query.lte('send_time', params.endTime);
    }

    // 添加分页
    const start = (page - 1) * PAGE_SIZE;
    query = query
      .range(start, start + PAGE_SIZE - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      records: data as SmsRecord[],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE)
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['smsRecords', currentPage, searchParams],
    queryFn: () => fetchSmsRecords({ page: currentPage, params: searchParams }),
  });

  const handleSearch = (params: SmsSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/mediation/sms-records"
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
        <MainContent username={mockUser.username} currentPath="/mediation/sms-records">
          <div className="space-y-4">
            <h1 className="text-xl font-medium text-text-primary">短信发送记录</h1>
            <SmsRecordsSearchForm onSearch={handleSearch} />
            <SmsRecordsTable
              data={data?.records || []}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={data?.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </MainContent>
      </div>
    </div>
  );
};

export default SmsRecords;