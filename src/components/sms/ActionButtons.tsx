import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ActionButtons = ({ onCancel, onSubmit, isSubmitting }: ActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        取消
      </Button>
      <Button 
        type="submit" 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "发送中..." : "提交"}
      </Button>
    </div>
  );
};