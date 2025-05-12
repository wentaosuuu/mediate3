import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Upload, 
  Download, 
  CheckSquare, 
  PackageCheck, 
  FileDown,
  Filter,
  Search
} from 'lucide-react';
import { ColumnSelector } from '../column-selection';

interface FormActionButtonsProps {
  visibleColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  onAddCase: () => void;
  onImportCases: () => void;
  onExportCases: () => void;
  onSelectedDistribution: () => void;
  onOneClickClose: () => void;
  onDownloadTemplate: () => void;
  onReset: () => void;
}

export const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  visibleColumns,
  onColumnsChange,
  onAddCase,
  onImportCases,
  onExportCases,
  onSelectedDistribution,
  onOneClickClose,
  onDownloadTemplate,
  onReset
}) => {
  return (
    <div className="mt-4 flex flex-wrap justify-between">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onAddCase}>
          <Plus className="mr-2 h-4 w-4" />
          新增
        </Button>
        <Button type="button" variant="outline" onClick={onImportCases}>
          <Upload className="mr-2 h-4 w-4" />
          导入案件
        </Button>
        <Button type="button" variant="outline" onClick={onExportCases}>
          <Download className="mr-2 h-4 w-4" />
          导出案件
        </Button>
        <Button type="button" variant="outline" onClick={onSelectedDistribution}>
          <CheckSquare className="mr-2 h-4 w-4" />
          选中分案
        </Button>
        <Button type="button" variant="outline" onClick={onOneClickClose}>
          <PackageCheck className="mr-2 h-4 w-4" />
          一键结案
        </Button>
        <Button type="button" variant="outline" onClick={onDownloadTemplate}>
          <FileDown className="mr-2 h-4 w-4" />
          下载案件导入模板
        </Button>
        <ColumnSelector 
          visibleColumns={visibleColumns} 
          onChange={onColumnsChange} 
        />
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button variant="outline" type="button" onClick={onReset}>
          <Filter className="mr-2 h-4 w-4" />
          重置
        </Button>
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          查询
        </Button>
      </div>
    </div>
  );
};
