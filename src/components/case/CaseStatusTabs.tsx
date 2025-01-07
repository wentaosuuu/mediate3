import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag, MessageSquare, CheckSquare } from 'lucide-react';

interface CaseStatusTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CaseStatusTabs = ({ value, onValueChange }: CaseStatusTabsProps) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-[400px] grid-cols-3">
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          待分配
        </TabsTrigger>
        <TabsTrigger value="mediation" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          调解中
        </TabsTrigger>
        <TabsTrigger value="closed" className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          已结案
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};