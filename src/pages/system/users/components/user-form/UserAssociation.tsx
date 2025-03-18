
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department } from '../../hooks/user-data/useFetchDepartments';
import { Role } from '../../hooks/user-data/useFetchRoles';
import { useFormContext } from 'react-hook-form';

// 部门和角色关联选择组件
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
  
  // 调试输出可用的部门和角色
  useEffect(() => {
    console.log("可选部门列表:", departments);
    console.log("可选角色列表:", roles);
  }, [departments, roles]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">权限与部门</h3>
      
      {/* 部门选择 */}
      <FormField
        name="department_id"
        render={({ field }) => {
          console.log("部门字段当前值:", field.value);
          return (
            <FormItem>
              <FormLabel>所属部门</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={(value) => {
                  console.log("部门选择变更为:", value);
                  field.onChange(value);
                }}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="none">无部门</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      
      {/* 角色选择 */}
      <FormField
        name="role_id"
        render={({ field }) => {
          console.log("角色字段当前值:", field.value);
          return (
            <FormItem>
              <FormLabel>角色</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={(value) => {
                  console.log("角色选择变更为:", value);
                  field.onChange(value);
                }}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="none">无角色</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default UserAssociation;
