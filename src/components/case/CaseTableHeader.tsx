import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const CaseTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="sticky left-0 z-20 bg-white w-[120px]">案件编号</TableHead>
        <div className="flex">
          <TableHead className="w-[120px]">批次编号</TableHead>
          <TableHead className="w-[120px]">借据编号</TableHead>
          <TableHead className="w-[120px]">身份证号</TableHead>
          <TableHead className="w-[100px]">客户姓名</TableHead>
          <TableHead className="w-[120px]">手机号</TableHead>
          <TableHead className="w-[100px]">产品线</TableHead>
          <TableHead className="w-[120px]">贷款金额</TableHead>
          <TableHead className="w-[120px]">已还金额</TableHead>
          <TableHead className="w-[120px]">剩余未还金额</TableHead>
          <TableHead className="w-[100px]">总期数</TableHead>
          <TableHead className="w-[120px]">剩余还款期数</TableHead>
          <TableHead className="w-[120px]">逾期日期</TableHead>
          <TableHead className="w-[100px]">逾期天数</TableHead>
          <TableHead className="w-[100px]">逾期M值</TableHead>
          <TableHead className="w-[100px]">跟进状态</TableHead>
          <TableHead className="w-[100px]">委托方</TableHead>
          <TableHead className="w-[100px]">委托周期</TableHead>
          <TableHead className="w-[120px]">委托是否到期</TableHead>
          <TableHead className="w-[120px]">委托到期时间</TableHead>
          <TableHead className="w-[120px]">首次委托时间</TableHead>
          <TableHead className="w-[120px]">最新跟进时间</TableHead>
          <TableHead className="w-[120px]">最新编辑时间</TableHead>
          <TableHead className="w-[120px]">案件分案时间</TableHead>
          <TableHead className="w-[120px]">案件入库时间</TableHead>
          <TableHead className="w-[120px]">案件结案时间</TableHead>
          <TableHead className="w-[100px]">优惠政策</TableHead>
          <TableHead className="w-[120px]">实还金额</TableHead>
          <TableHead className="w-[120px]">减免金额</TableHead>
          <TableHead className="w-[120px]">分期金额</TableHead>
          <TableHead className="w-[100px]">分期期数</TableHead>
          <TableHead className="w-[100px]">调解状态</TableHead>
        </div>
        <TableHead className="sticky right-0 z-20 bg-white w-[120px]">操作</TableHead>
      </TableRow>
    </TableHeader>
  );
};