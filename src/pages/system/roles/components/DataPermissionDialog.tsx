
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// 数据权限类型
export type DataPermissionType = 
  | '全部数据权限' 
  | '自定数据权限' 
  | '本部门数据权限' 
  | '本部门及以下数据权限' 
  | '仅本人数据权限';

// 数据权限选项
const permissionOptions: DataPermissionType[] = [
  '全部数据权限',
  '自定数据权限',
  '本部门数据权限',
  '本部门及以下数据权限',
  '仅本人数据权限'
];

interface DataPermissionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: {
    id: string;
    name: string;
  } | null;
  onSave: (roleId: string, code: string, permissionType: DataPermissionType) => Promise<void>;
}

// 数据权限弹窗组件
const DataPermissionDialog = ({ 
  isOpen, 
  setIsOpen, 
  role, 
  onSave 
}: DataPermissionDialogProps) => {
  // 权限状态
  const [permissionType, setPermissionType] = useState<DataPermissionType>('全部数据权限');
  const [permissionCode, setPermissionCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当角色变化时重置表单
  useEffect(() => {
    if (role) {
      // 这里可以添加获取角色现有数据权限的逻辑
      // 默认使用全部数据权限
      setPermissionType('全部数据权限');
      setPermissionCode('admin');
    }
  }, [role]);

  // 保存数据权限
  const handleSave = async () => {
    if (!role) return;
    
    setIsSubmitting(true);
    try {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>分配数据权限</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 角色名称 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleName" className="text-right">
              角色名称
            </Label>
            <Input
              id="roleName"
              value={role?.name || ''}
              className="col-span-3"
              readOnly
            />
          </div>
          
          {/* 权限字符 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="permissionCode" className="text-right">
              权限字符
            </Label>
            <Input
              id="permissionCode"
              value={permissionCode}
              onChange={(e) => setPermissionCode(e.target.value)}
              className="col-span-3"
              placeholder="请输入权限字符"
            />
          </div>
          
          {/* 权限范围 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="permissionType" className="text-right">
              权限范围
            </Label>
            <div className="col-span-3 relative">
              <Select 
                value={permissionType} 
                onValueChange={(value) => setPermissionType(value as DataPermissionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择权限范围" />
                </SelectTrigger>
                <SelectContent>
                  {permissionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataPermissionDialog;
