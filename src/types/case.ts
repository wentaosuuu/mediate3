
import { ReactNode } from "react";

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
}
