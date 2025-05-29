
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface MediationSearchFormProps {
  onSearch: (params: any) => void;
  onReset: () => void;
}

export const MediationSearchForm = ({ onSearch, onReset }: MediationSearchFormProps) => {
  const [searchParams, setSearchParams] = useState({
    caseNumber: '',
    batchNumber: '',
    borrowerNumber: '',
    idNumber: '',
    customerName: '',
    phone: '',
    productLine: '',
    receiver: '',
    adjuster: '',
    progressStatus: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      caseNumber: '',
      batchNumber: '',
      borrowerNumber: '',
      idNumber: '',
      customerName: '',
      phone: '',
      productLine: '',
      receiver: '',
      adjuster: '',
      progressStatus: ''
    });
    onReset();
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="caseNumber" className="text-sm font-medium">案件编号</Label>
          <Input
            id="caseNumber"
            placeholder="请输入案件编号"
            value={searchParams.caseNumber}
            onChange={(e) => handleInputChange('caseNumber', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="batchNumber" className="text-sm font-medium">批次编号</Label>
          <Input
            id="batchNumber"
            placeholder="请输入批次编号"
            value={searchParams.batchNumber}
            onChange={(e) => handleInputChange('batchNumber', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="borrowerNumber" className="text-sm font-medium">借据编号</Label>
          <Input
            id="borrowerNumber"
            placeholder="请输入借据编号"
            value={searchParams.borrowerNumber}
            onChange={(e) => handleInputChange('borrowerNumber', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="idNumber" className="text-sm font-medium">身份证号</Label>
          <Input
            id="idNumber"
            placeholder="请输入身份证号"
            value={searchParams.idNumber}
            onChange={(e) => handleInputChange('idNumber', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="customerName" className="text-sm font-medium">客户姓名</Label>
          <Input
            id="customerName"
            placeholder="请输入客户姓名"
            value={searchParams.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">手机号</Label>
          <Input
            id="phone"
            placeholder="请输入手机号"
            value={searchParams.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="productLine" className="text-sm font-medium">产品线</Label>
          <Input
            id="productLine"
            placeholder="请输入产品线"
            value={searchParams.productLine}
            onChange={(e) => handleInputChange('productLine', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="receiver" className="text-sm font-medium">受托方</Label>
          <Input
            id="receiver"
            placeholder="请输入受托方"
            value={searchParams.receiver}
            onChange={(e) => handleInputChange('receiver', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="adjuster" className="text-sm font-medium">调解员</Label>
          <Input
            id="adjuster"
            placeholder="请选择调解员"
            value={searchParams.adjuster}
            onChange={(e) => handleInputChange('adjuster', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="progressStatus" className="text-sm font-medium">调进状态</Label>
          <Input
            id="progressStatus"
            placeholder="请输入调进状态"
            value={searchParams.progressStatus}
            onChange={(e) => handleInputChange('progressStatus', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white">
          搜索
        </Button>
        <Button variant="outline" onClick={handleReset}>
          重置
        </Button>
      </div>
    </Card>
  );
};
