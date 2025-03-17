
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Department } from '../../hooks/user-data/useFetchDepartments';
import { Role } from '../../hooks/user-data/useFetchRoles';

// 部门和角色关联组件
const UserAssociation = ({ 
  isLoading, 
  departments, 
  roles 
}: { 
  isLoading: boolean, 
  departments: Department[], 
  roles: Role[] 
}) => {
  const form = useFormContext();
  
  // 确保departments和roles不为undefined
  const safeRoles = roles || [];
  const safeDepartments = departments || [];
  
  return (
    <>
      <FormField
        control={form.control}
        name="department_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>所属部门</FormLabel>
            <FormControl>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {safeDepartments.length === 0 ? (
                    <SelectItem value="no_departments" disabled>暂无可用部门</SelectItem>
                  ) : (
                    safeDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>角色</FormLabel>
            <FormControl>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {safeRoles.length === 0 ? (
                    <SelectItem value="no_roles" disabled>暂无可用角色</SelectItem>
                  ) : (
                    safeRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default UserAssociation;
