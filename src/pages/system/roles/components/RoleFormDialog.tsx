
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import RoleBasicInfo from './form/RoleBasicInfo';
import RoleFormActions from './form/RoleFormActions';
import PermissionsSelect from './PermissionsSelect';
import { useRoleForm, RoleFormValues } from '../hooks/useRoleForm';

interface Permission {
  id: string;
  name: string;
}

interface RoleFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: any;
  permissions: Permission[];
  fetchRolePermissions: (roleId: string) => Promise<string[]>;
  onSubmit: (values: RoleFormValues, permissions: string[]) => Promise<void>;
  isLoading: boolean;
}

/**
 * 角色表单对话框组件
 * 管理角色的创建和编辑
 */
const RoleFormDialog = ({ 
  isOpen, 
  setIsOpen, 
  currentRole, 
  permissions, 
  fetchRolePermissions,
  onSubmit, 
  isLoading 
}: RoleFormDialogProps) => {
  // 使用角色表单钩子
  const { form, selectedPermissions, setSelectedPermissions } = useRoleForm(
    currentRole,
    isOpen,
    fetchRolePermissions
  );

  // 处理表单提交
  const handleSubmit = async (values: RoleFormValues) => {
    await onSubmit(values, selectedPermissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{currentRole ? "编辑角色" : "创建角色"}</DialogTitle>
          <DialogDescription>
            {currentRole 
              ? "修改角色信息，完成后点击保存。" 
              : "填写角色信息，完成后点击创建。"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <RoleBasicInfo isLoading={isLoading} />
            
            <PermissionsSelect
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
            />
            
            <RoleFormActions 
              isLoading={isLoading}
              currentRole={currentRole}
              onCancel={() => setIsOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormDialog;
