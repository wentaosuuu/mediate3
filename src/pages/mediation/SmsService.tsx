import React from 'react';
import { MainContent } from '@/components/dashboard/MainContent';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const SmsService = () => {
  return (
    <MainContent currentPath="/mediation/sms-service" username={null}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">短信触达服务</h1>
        
        {/* Search Form */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="短信模板内容" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="短信类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">类型1</SelectItem>
                  <SelectItem value="type2">类型2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="发送状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sent">已发送</SelectItem>
                  <SelectItem value="failed">发送失败</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input type="datetime-local" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input type="datetime-local" />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">搜索</Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-x-2">
          <Button variant="outline">+ 新增</Button>
          <Button variant="outline">导出Excel</Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>序号</TableHead>
                <TableHead>发送编码</TableHead>
                <TableHead>短信模板</TableHead>
                <TableHead>短信类型</TableHead>
                <TableHead>发送对象</TableHead>
                <TableHead>发送时间</TableHead>
                <TableHead>发送成功（人）</TableHead>
                <TableHead>发送失败（人）</TableHead>
                <TableHead>超频失败（人）</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>创建人</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </MainContent>
  );
};

export default SmsService;