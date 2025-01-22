import React from 'react';
import { DepartmentQuotaForm } from '@/components/quota/department/DepartmentQuotaForm';
import { DepartmentQuotaHistory } from '@/components/quota/department/DepartmentQuotaHistory';

const DepartmentQuota = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">部门额度分配</h2>
      </div>
      
      {/* 额度分配表单 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <DepartmentQuotaForm />
      </div>

      {/* 历史记录 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <DepartmentQuotaHistory />
      </div>
    </div>
  );
};

export default DepartmentQuota;