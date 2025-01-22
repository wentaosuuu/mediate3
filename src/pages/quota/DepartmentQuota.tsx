import React from 'react';
import { DepartmentQuotaForm } from '@/components/quota/department/DepartmentQuotaForm';
import { DepartmentQuotaHistory } from '@/components/quota/department/DepartmentQuotaHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DepartmentQuota = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">部门额度分配</h1>
      
      <Tabs defaultValue="allocation" className="w-full">
        <TabsList>
          <TabsTrigger value="allocation">额度分配</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allocation">
          <DepartmentQuotaForm />
        </TabsContent>
        
        <TabsContent value="history">
          <DepartmentQuotaHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentQuota;