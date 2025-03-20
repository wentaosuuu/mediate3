
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Columns } from 'lucide-react';

// 定义列信息和标题的映射
const columnTitles: Record<string, string> = {
  caseNumber: '案件编号',
  batchNumber: '批次编号',
  borrowerNumber: '借据编号',
  idNumber: '身份证号',
  customerName: '客户姓名',
  phone: '手机号',
  productLine: '产品线',
  receiver: '受托方',
  adjuster: '调解员',
  distributor: '分案员',
  progressStatus: '跟进状态',
  latestProgressTime: '最新跟进时间',
  latestEditTime: '最新编辑时间',
  caseEntryTime: '案件入库时间',
  distributionTime: '分案时间',
  resultTime: '结案时间'
};

interface ColumnSelectorProps {
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({ visibleColumns, onChange }) => {
  // 本地状态，用于临时保存用户的选择
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(visibleColumns);

  // 处理复选框变化
  const handleCheckboxChange = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, columnId]);
    } else {
      setSelectedColumns(selectedColumns.filter(id => id !== columnId));
    }
  };

  // 保存更改
  const handleSave = () => {
    // 至少要保留一列，否则拒绝保存
    if (selectedColumns.length === 0) {
      alert('请至少选择一列显示');
      return;
    }
    onChange(selectedColumns);
  };

  // 全选
  const handleSelectAll = () => {
    setSelectedColumns(Object.keys(columnTitles));
  };

  // 全不选
  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Columns className="h-4 w-4 mr-2" />
          自定义显示列
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>自定义显示列</SheetTitle>
          <SheetDescription>
            选择要在表格中显示的列。
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={handleSelectAll} size="sm">
              全选
            </Button>
            <Button type="button" variant="outline" onClick={handleSelectNone} size="sm">
              全不选
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-4 h-[calc(100vh-250px)] overflow-y-auto">
            {Object.entries(columnTitles).map(([columnId, title]) => (
              <div key={columnId} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${columnId}`}
                  checked={selectedColumns.includes(columnId)}
                  onCheckedChange={(checked) => handleCheckboxChange(columnId, checked === true)}
                />
                <label
                  htmlFor={`column-${columnId}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {title}
                </label>
              </div>
            ))}
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleSave} className="mt-4 w-full">保存设置</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
