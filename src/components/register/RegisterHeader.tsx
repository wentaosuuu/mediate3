import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RegisterHeader = () => {
  return (
    <div className="text-left mb-8">
      <h1 className="text-2xl font-bold text-primary mb-2">法调云</h1>
      <h2 className="text-3xl font-bold mb-4">法调云2.0</h2>
      <p className="text-lg text-text-secondary">
        为调解中心、律所、清收公司等提供金融贷后处置解智能化解决方案
      </p>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-text-secondary">租户编号</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>如忘记租户编号，请联系业务经理找回</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default RegisterHeader;