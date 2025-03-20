
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { TextField } from './form-fields/TextField';
import { DateRangeField } from './form-fields/DateRangeField';
import { FormActionButtons } from './form-actions/FormActionButtons';
import { 
  searchSchema, 
  SearchFormValues, 
  textFields, 
  dateRangeFields,
  transformDateRanges
} from './form-config/searchFormConfig';
import { CaseSearchFormProps } from '@/types/case';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const CaseSearchForm = ({
  onSearch,
  onReset,
  onAddCase,
  onImportCases,
  onExportCases,
  onColumnsChange,
  visibleColumns,
  onSelectedDistribution,
  onOneClickClose,
  onDownloadTemplate,
}: CaseSearchFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      caseNumber: '',
      batchNumber: '',
      borrowerNumber: '',
      idNumber: '',
      customerName: '',
      phone: '',
      productLine: '',
      receiver: '',
      adjuster: '',
      distributor: '',
      progressStatus: '',
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    // 转换日期范围为字符串格式
    const transformedValues = transformDateRanges(values);
    onSearch(transformedValues);
  };

  const handleReset = () => {
    form.reset();
    onReset();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white p-4 rounded-lg shadow-sm">
        <Collapsible
          open={isExpanded}
          onOpenChange={setIsExpanded}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">搜索条件</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" onClick={toggleExpand}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isExpanded ? "收起" : "展开"}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* 渲染文本字段 */}
              {textFields.map((field) => (
                <TextField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  label={field.label}
                />
              ))}
              
              {/* 渲染日期范围字段 */}
              {dateRangeFields.map((field) => (
                <DateRangeField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  label={field.label}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* 表单操作按钮 */}
        <FormActionButtons
          visibleColumns={visibleColumns}
          onColumnsChange={onColumnsChange}
          onAddCase={onAddCase}
          onImportCases={onImportCases}
          onExportCases={onExportCases}
          onSelectedDistribution={onSelectedDistribution}
          onOneClickClose={onOneClickClose}
          onDownloadTemplate={onDownloadTemplate}
          onReset={handleReset}
        />
      </form>
    </Form>
  );
};
