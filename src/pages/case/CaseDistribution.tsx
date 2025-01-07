import React from 'react';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';

const CaseDistribution = () => {
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">分案管理</h1>
      <CaseSearchForm />
      <CaseTable />
    </div>
  );
};

export default CaseDistribution;