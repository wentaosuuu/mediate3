
import React from 'react';
import { CaseSearchForm } from '@/components/case/CaseSearchForm';
import { CaseTable } from '@/components/case/CaseTable';
import { CaseStatusTabs } from '@/components/case/CaseStatusTabs';
import { DepartmentSidebar } from '@/components/case/DepartmentSidebar';
import { Case } from '@/types/case';

interface CaseDistributionLayoutProps {
  cases: Case[];
  isLoading: boolean;
  visibleColumns: string[];
  selectedDepartment: string;
  caseStatus: string;
  selectedCasesCount?: number;
  onDepartmentSelect: (departmentId: string) => void;
  onStatusChange: (status: string) => void;
  onSearch: (values: any) => void;
  onReset: () => void;
  onAddCase: () => void;
  onImportCases: () => void;
  onExportCases: () => void;
  onColumnsChange: (columns: string[]) => void;
  onSelectedDistribution: () => void;
  onOneClickClose: () => void;
  onDownloadTemplate: () => void;
  onCaseEdit?: (caseData: Case) => void;
  onCaseDelete?: (caseData: Case) => void;
  onCaseSelect?: (caseId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  selectedCases?: Record<string, boolean>;
}

export const CaseDistributionLayout: React.FC<CaseDistributionLayoutProps> = ({
  cases,
  isLoading,
  visibleColumns,
  selectedDepartment,
  caseStatus,
  selectedCasesCount = 0,
  onDepartmentSelect,
  onStatusChange,
  onSearch,
  onReset,
  onAddCase,
  onImportCases,
  onExportCases,
  onColumnsChange,
  onSelectedDistribution,
  onOneClickClose,
  onDownloadTemplate,
  onCaseEdit,
  onCaseDelete,
  onCaseSelect,
  onSelectAll,
  selectedCases = {}
}) => {
  return (
    <>
      <div className="mb-4">
        <CaseStatusTabs value={caseStatus} onValueChange={onStatusChange} />
      </div>
      <div className="flex">
        <DepartmentSidebar
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={onDepartmentSelect}
        />
        <div className="flex-1 space-y-4">
          <CaseSearchForm
            onSearch={onSearch}
            onReset={onReset}
            onAddCase={onAddCase}
            onImportCases={onImportCases}
            onExportCases={onExportCases}
            onColumnsChange={onColumnsChange}
            visibleColumns={visibleColumns}
            onSelectedDistribution={onSelectedDistribution}
            onOneClickClose={onOneClickClose}
            onDownloadTemplate={onDownloadTemplate}
            selectedCasesCount={selectedCasesCount}
          />
          <CaseTable 
            data={cases} 
            isLoading={isLoading} 
            visibleColumns={visibleColumns}
            onCaseEdit={onCaseEdit}
            onCaseDelete={onCaseDelete}
            onCaseSelect={onCaseSelect}
            onSelectAll={onSelectAll}
            selectedCases={selectedCases}
          />
        </div>
      </div>
    </>
  );
};
