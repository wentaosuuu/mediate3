
import React from 'react';
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
  
  return (
    <FormItem>
      <FormLabel>权限设置</FormLabel>
      <div className="grid grid-cols-3 gap-3 border p-3 rounded-md">
        {permissions.map(permission => (
          <div key={permission.id} className="flex items-center">
            <input
              type="checkbox"
              id={permission.id}
              value={permission.id}
              className="mr-2 h-4 w-4"
              onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
              checked={selectedPermissions.includes(permission.id)}
            />
            <label htmlFor={permission.id} className="text-sm">{permission.name}</label>
          </div>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default PermissionsSelect;
