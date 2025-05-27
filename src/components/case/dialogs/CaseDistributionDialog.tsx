
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface CaseDistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCasesCount: number;
  onConfirm: (distributorId: string) => void;
}

// 模拟分案员数据，实际项目中应该从后端获取
const mockDistributors = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
];

export const CaseDistributionDialog = ({ 
  open, 
  onOpenChange, 
  selectedCasesCount,
  onConfirm 
}: CaseDistributionDialogProps) => {
  const [selectedDistributor, setSelectedDistributor] = useState<string>('');

  const handleConfirm = () => {
    if (!selectedDistributor) {
      toast.error('请选择分案员');
      return;
    }
    
    onConfirm(selectedDistributor);
    setSelectedDistributor('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedDistributor('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>选中分案</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            您已选择 <span className="font-medium text-blue-600">{selectedCasesCount}</span> 个案件进行分案
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distributor">选择分案员</Label>
            <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
              <SelectTrigger>
                <SelectValue placeholder="请选择分案员" />
              </SelectTrigger>
              <SelectContent>
                {mockDistributors.map((distributor) => (
                  <SelectItem key={distributor.id} value={distributor.id}>
                    {distributor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认分案
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
