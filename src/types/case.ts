
import { ReactNode } from "react";

// 修改DateRange接口定义，使其与react-day-picker兼容
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined; // 将 to 设为可选属性，与 react-day-picker 的定义保持一致
}

export interface Case {
  id: string;
  case_number: string;
  batch_number: string;
  borrower_number: string;
  id_number: string;
  customer_name: string;
  phone: string | null;
  product_line: string | null;
  receiver: string | null;
  adjuster: string | null;
  distributor: string | null;
  progress_status: string | null;
  latest_progress_time: string | null;
  latest_edit_time: string | null;
  case_entry_time: string | null;
  distribution_time: string | null;
  result_time: string | null;
}

export interface CaseTableProps {
  data: Case[];
  isLoading: boolean;
  visibleColumns?: string[];
}

export interface CaseStatusTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export interface DepartmentSidebarProps {
  selectedDepartment: string;
  onDepartmentSelect: (id: string) => void;
}

export interface CaseSearchFormProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  onAddCase: () => void;
  onImportCases: () => void;
  onExportCases: () => void;
  onColumnsChange: (columns: string[]) => void;
  visibleColumns: string[];
  onSelectedDistribution: () => void;
  onOneClickClose: () => void;
  onDownloadTemplate: () => void;
  selectedCasesCount?: number; // 添加选中案件数量字段
}

export interface NewCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newCase: Case) => void;
}

export interface ImportCasesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (cases: Case[]) => void;
  onDownloadTemplate: () => void;
}
