
import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationProps {
  variant?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export function Notification({
  variant = 'info',
  title,
  description,
  onClose,
  className,
}: NotificationProps) {
  const variantStyles = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      iconColor: 'text-green-500',
      icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      iconColor: 'text-red-500',
      icon: AlertCircle,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-500',
      icon: Info,
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-400', 
      iconColor: 'text-amber-500',
      icon: AlertCircle,
    },
  };

  const { bgColor, borderColor, iconColor, icon: Icon } = variantStyles[variant];

  return (
    <div
      className={cn(
        'fixed top-4 right-4 w-96 max-w-[90%] z-50 rounded-md border px-4 py-3 shadow-lg',
        bgColor,
        borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('h-5 w-5 flex-shrink-0', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-700">{description}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200/50"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
