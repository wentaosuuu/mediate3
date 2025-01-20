import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// 案件状态映射
const caseStatusMap = {
  'PENDING': { label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
  'IN_PROGRESS': { label: '处理中', color: 'bg-blue-100 text-blue-800' },
  'COMPLETED': { label: '已完成', color: 'bg-green-100 text-green-800' },
  'CLOSED': { label: '已关闭', color: 'bg-gray-100 text-gray-800' }
};

const CaseManagement = () => {
  // 获取案件列表
  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">案件管理</h2>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 text-left">案件编号</th>
              <th className="py-4 px-6 text-left">客户姓名</th>
              <th className="py-4 px-6 text-left">产品线</th>
              <th className="py-4 px-6 text-left">受理人</th>
              <th className="py-4 px-6 text-left">创建时间</th>
              <th className="py-4 px-6 text-center">状态</th>
            </tr>
          </thead>
          <tbody>
            {cases?.map((caseItem) => (
              <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{caseItem.case_number}</td>
                <td className="py-4 px-6">{caseItem.customer_name}</td>
                <td className="py-4 px-6">{caseItem.product_line || '-'}</td>
                <td className="py-4 px-6">{caseItem.receiver || '-'}</td>
                <td className="py-4 px-6">
                  {caseItem.created_at ? 
                    format(new Date(caseItem.created_at), 'yyyy-MM-dd HH:mm:ss') 
                    : '-'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <Badge 
                      className={`${
                        caseStatusMap[
                          (caseItem.progress_status as keyof typeof caseStatusMap) || 'PENDING'
                        ].color
                      }`}
                    >
                      {caseStatusMap[
                        (caseItem.progress_status as keyof typeof caseStatusMap) || 'PENDING'
                      ].label}
                    </Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CaseManagement;