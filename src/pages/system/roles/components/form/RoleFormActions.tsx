
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface RoleFormActionsProps {
  isLoading: boolean;
  currentRole: any | null;
  onCancel: () => void;
}

/**
 * 角色表单操作按钮组件
 * 包含取消和提交按钮
 */
const RoleFormActions = ({ isLoading, currentRole, onCancel }: RoleFormActionsProps) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        取消
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "处理中..." : currentRole ? "保存" : "创建"}
      </Button>
    </DialogFooter>
  );
};

export default RoleFormActions;
