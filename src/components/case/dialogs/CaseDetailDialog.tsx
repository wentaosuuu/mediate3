
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Case } from '@/types/case';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CaseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case | null;
}

export const CaseDetailDialog = ({ open, onOpenChange, caseData }: CaseDetailDialogProps) => {
  if (!caseData) return null;

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return '-';
    }
  };

  const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
      <div className="font-medium text-gray-600">{label}</div>
      <div className="col-span-2 text-gray-900">{value || '-'}</div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>案件详情</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">基本信息</h3>
              <div className="space-y-1">
                <DetailItem label="案件编号" value={caseData.case_number} />
                <DetailItem label="批次编号" value={caseData.batch_number} />
                <DetailItem label="借据编号" value={caseData.borrower_number} />
                <DetailItem label="身份证号" value={caseData.id_number} />
                <DetailItem label="客户姓名" value={caseData.customer_name} />
                <DetailItem label="手机号" value={caseData.phone} />
                <DetailItem label="产品线" value={caseData.product_line} />
              </div>
            </div>

            {/* 分配信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-600">分配信息</h3>
              <div className="space-y-1">
                <DetailItem label="受托方" value={caseData.receiver} />
                <DetailItem label="调解员" value={caseData.adjuster} />
                <DetailItem label="分案员" value={caseData.distributor} />
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-600">跟进状态</div>
                  <div className="col-span-2">
                    {caseData.progress_status ? (
                      <Badge variant="outline">{caseData.progress_status}</Badge>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 时间信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-600">时间信息</h3>
              <div className="space-y-1">
                <DetailItem label="最新跟进时间" value={formatDate(caseData.latest_progress_time)} />
                <DetailItem label="最新编辑时间" value={formatDate(caseData.latest_edit_time)} />
                <DetailItem label="案件录入时间" value={formatDate(caseData.case_entry_time)} />
                <DetailItem label="分案时间" value={formatDate(caseData.distribution_time)} />
                <DetailItem label="结案时间" value={formatDate(caseData.result_time)} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
