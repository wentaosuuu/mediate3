
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from '@/types/case';
import { Control } from 'react-hook-form';

interface DateRangeFieldProps {
  control: Control<any>;
  name: string;
  label: string;
}

export const DateRangeField: React.FC<DateRangeFieldProps> = ({ control, name, label }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateRangePicker 
              value={field.value as DateRange}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
