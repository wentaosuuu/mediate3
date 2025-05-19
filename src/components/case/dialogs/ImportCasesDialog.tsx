
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileDown } from 'lucide-react';
import { Case } from '@/types/case';
import { readExcelFile } from '@/utils/excelUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportCasesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (cases: Case[]) => void;
  onDownloadTemplate: () => void;
}

export const ImportCasesDialog: React.FC<ImportCasesDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  onDownloadTemplate
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 检查文件类型
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setUploadError('请上传Excel文件（.xlsx或.xls格式）');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!file) {
      setUploadError('请先选择文件');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 读取Excel文件内容
      const cases = await readExcelFile(file);
      
      if (cases.length === 0) {
        setUploadError('导入的文件没有有效的案件数据');
        setIsUploading(false);
        return;
      }

      console.log('Excel解析得到的案件数据:', cases);
      
      // 通知父组件导入成功
      onSuccess(cases);
      
      // 重置状态并关闭对话框
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // 显示成功提示
      toast.success(`Excel解析成功，准备导入 ${cases.length} 条案件记录`);
      
      // 延迟关闭对话框
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (error: any) {
      console.error('解析Excel失败:', error);
      setUploadError(`导入案件失败: ${error?.message || '请检查文件格式是否正确'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 触发文件选择
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 对话框关闭时重置状态
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFile(null);
      setUploadError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>导入案件</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadTemplate}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              下载导入模板
            </Button>
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-gray-400" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  {file ? file.name : '点击或拖拽Excel文件到这里上传'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  支持 .xlsx 和 .xls 格式
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="mt-2"
              >
                选择文件
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            取消
          </Button>
          <Button 
            type="button" 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? '正在处理...' : '确认导入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
