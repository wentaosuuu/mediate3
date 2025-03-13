
import React from 'react';
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Permission {
  id: string;
  name: string;
}

interface PermissionsSelectProps {
  permissions: Permission[];
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
}

// 权限选择组件
const PermissionsSelect = ({ 
  permissions, 
  selectedPermissions, 
  setSelectedPermissions 
}: PermissionsSelectProps) => {
  
  // 处理权限选择变更
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };
  
  // 全选/全不选处理函数
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // 全选 - 获取所有权限的ID
      const allPermissionIds = permissions.map(permission => permission.id);
      setSelectedPermissions(allPermissionIds);
    } else {
      // 全不选 - 清空选择
      setSelectedPermissions([]);
    }
  };
  
  // 判断当前是否全部选中
  const isAllSelected = permissions.length > 0 && 
    permissions.every(permission => selectedPermissions.includes(permission.id));
  
  return (
    <FormItem>
      <FormLabel>权限设置</FormLabel>
      <div className="space-y-3 border p-3 rounded-md">
        {/* 全选/全不选控制区 */}
        <div className="flex items-center pb-2 border-b border-gray-200">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            {isAllSelected ? "全不选" : "全选"}
          </label>
        </div>
        
        {/* 权限选择列表 */}
        <div className="grid grid-cols-3 gap-3">
          {permissions.map(permission => (
            <div key={permission.id} className="flex items-center">
              <Checkbox
                id={permission.id}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor={permission.id} className="text-sm">{permission.name}</label>
            </div>
          ))}
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default PermissionsSelect;
