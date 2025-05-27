
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ImportError {
  row: number;
  field: string;
  value: string;
  message: string;
}

interface ImportErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: ImportError[];
  totalRows: number;
}

export const ImportErrorDialog = ({ 
  open, 
  onOpenChange, 
  errors, 
  totalRows 
}: ImportErrorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            导入失败
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              检测到 {errors.length} 个错误，共 {totalRows} 行数据。请修正以下问题后重新导入：
            </AlertDescription>
          </Alert>

          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3">
              {errors.map((error, index) => (
                <div key={index} className="border rounded-lg p-3 bg-red-50">
                  <div className="text-sm">
                    <div className="font-medium text-red-800">
                      第 {error.row} 行，字段：{error.field}
                    </div>
                    <div className="text-gray-600 mt-1">
                      值：{error.value}
                    </div>
                    <div className="text-red-600 mt-1">
                      错误：{error.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
