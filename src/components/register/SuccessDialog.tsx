import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SuccessDialogProps {
  showSuccessDialog: boolean;
  setShowSuccessDialog: (show: boolean) => void;
  tenantId: string;
  onCopyTenantId: () => void;
}

const SuccessDialog = ({
  showSuccessDialog,
  setShowSuccessDialog,
  tenantId,
  onCopyTenantId,
}: SuccessDialogProps) => {
  return (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>注册成功</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">您的租户号是：</p>
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <span className="font-mono">{tenantId}</span>
            <Button variant="outline" size="icon" onClick={onCopyTenantId}>
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

export default SuccessDialog;