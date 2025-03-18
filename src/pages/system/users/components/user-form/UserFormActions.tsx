
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";

// 表单操作按钮组件
const UserFormActions = ({ 
  isLoading, 
  currentUser, 
  onCancel 
}: { 
  isLoading: boolean, 
  currentUser: any | null, 
  onCancel: () => void 
}) => {
  console.log("渲染表单操作按钮，加载状态:", isLoading);
  
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        取消
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? "处理中..." : currentUser ? "保存" : "创建"}
      </Button>
    </DialogFooter>
  );
};

export default UserFormActions;
