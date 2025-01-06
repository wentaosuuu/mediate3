import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationCodeProps {
  code: string;
  onRefresh: () => void;
}

export const VerificationCode = ({ code, onRefresh }: VerificationCodeProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-32 h-10 bg-gray-100 flex items-center justify-center rounded-lg font-mono text-lg tracking-wider">
        {code}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};