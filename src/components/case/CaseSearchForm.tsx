import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

export const CaseSearchForm = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            案件编号
          </label>
          <Input placeholder="请输入案件编号" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            批次编号
          </label>
          <Input placeholder="请输入批次编号" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            借据编号
          </label>
          <Input placeholder="请输入借据编号" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            身份证号
          </label>
          <Input placeholder="请输入身份证号" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            客户姓名
          </label>
          <Input placeholder="请输入客户姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            手机号
          </label>
          <Input placeholder="请输入手机号" />
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          重置
        </Button>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          查询
        </Button>
      </div>
    </div>
  );
};