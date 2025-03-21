import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/**
 * 注册成功对话框组件的属性接口
 */
interface SuccessDialogProps {
  open: boolean;                          // 对话框是否打开
  onOpenChange: (open: boolean) => void;  // 对话框状态变更处理函数
  tenantId: string;                       // 租户ID
}

/**
 * 注册成功对话框组件
 * 显示注册成功信息和租户ID
 */
export const SuccessDialog = ({ open, onOpenChange, tenantId }: SuccessDialogProps) => {
  const { toast } = useToast();

  /**
   * 复制租户ID到剪贴板
   */
  const copyTenantId = () => {
    navigator.clipboard.writeText(tenantId);
    toast({
      title: "复制成功",
      description: "租户号已复制到剪贴板",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>注册成功</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">您的租户号是：</p>
          {/* 租户ID显示和复制按钮 */}
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <span className="font-mono">{tenantId}</span>
            <Button variant="outline" size="icon" onClick={copyTenantId}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            请保存好您的租户号，登录时需要使用
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => window.location.href = "/"}>
            返回登录
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};