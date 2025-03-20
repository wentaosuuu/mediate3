
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface TextFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ 
  control, 
  name, 
  label, 
  placeholder = `请输入${label}` 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
