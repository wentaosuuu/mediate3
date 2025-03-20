
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Role {
  id: string;
  name: string;
  permission_code?: string;
  data_permission_type?: string;
}

interface DataPermissionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: Role | null;
  onSave: (roleId: string, permissionCode: string, permissionType: string) => Promise<void>;
}

/**
 * 数据权限对话框组件
 * 用于设置角色的数据访问权限
 */
const DataPermissionDialog = ({ isOpen, setIsOpen, role, onSave }: DataPermissionDialogProps) => {
  // 获取当前角色的权限设置或使用默认值
  const [permissionCode, setPermissionCode] = useState<string>(role?.permission_code || 'all');
  const [permissionType, setPermissionType] = useState<string>(role?.data_permission_type || 'all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 权限范围选项
  const permissionCodes = [
    { value: 'all', label: '全部数据' },
    { value: 'dept', label: '本部门数据' },
    { value: 'self', label: '本人数据' }
  ];

  // 权限类型选项
  const permissionTypes = [
    { value: 'all', label: '全部权限' },
    { value: 'read', label: '只读权限' },
    { value: 'write', label: '读写权限' }
  ];

  // 当对话框打开时，重置表单状态
  React.useEffect(() => {
    if (isOpen && role) {
      console.log("当前角色数据权限设置:", role);
      setPermissionCode(role.permission_code || 'all');
      setPermissionType(role.data_permission_type || 'all');
    }
  }, [isOpen, role]);

  // 保存权限设置
  const handleSave = async () => {
    if (!role) return;
    
    try {
      console.log("提交数据权限设置:", {
        roleId: role.id,
        permissionCode,
        permissionType
      });
      
      setIsSubmitting(true);
      await onSave(role.id, permissionCode, permissionType);
      setIsOpen(false);
    } catch (error) {
      console.error('保存数据权限失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {role ? `设置 "${role.name}" 的数据权限` : '设置数据权限'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="permission-code">数据范围</Label>
            <Select
              value={permissionCode}
              onValueChange={setPermissionCode}
              disabled={isSubmitting}
            >
              <SelectTrigger id="permission-code">
                <SelectValue placeholder="选择数据范围" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {permissionCodes.map(code => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="permission-type">权限类型</Label>
            <Select
              value={permissionType}
              onValueChange={setPermissionType}
              disabled={isSubmitting}
            >
              <SelectTrigger id="permission-type">
                <SelectValue placeholder="选择权限类型" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {permissionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataPermissionDialog;
