
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const MediationStatusTabs = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="px-4 py-3">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-8 bg-gray-100">
          <TabsTrigger value="all" className="text-sm px-4 py-1">
            全部
          </TabsTrigger>
          <TabsTrigger value="today" className="text-sm px-4 py-1">
            今日待调解
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-sm px-4 py-1">
            今日已调解
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
