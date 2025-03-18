
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

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
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        取消
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="min-w-[80px]"
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            处理中...
          </span>
        ) : (
          currentUser ? "保存" : "创建"
        )}
      </Button>
    </DialogFooter>
  );
};

export default UserFormActions;
