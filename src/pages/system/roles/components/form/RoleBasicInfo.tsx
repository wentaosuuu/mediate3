
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface RoleBasicInfoProps {
  isLoading: boolean;
}

/**
 * 角色基本信息表单组件
 * 包含角色名称和描述字段
 */
const RoleBasicInfo = ({ isLoading }: RoleBasicInfoProps) => {
  const form = useFormContext();
  
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>角色名称</FormLabel>
            <FormControl>
              <Input {...field} placeholder="请输入角色名称" disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>角色描述</FormLabel>
            <FormControl>
              <Input {...field} placeholder="请输入角色描述" disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RoleBasicInfo;
