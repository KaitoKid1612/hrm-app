'use client';

import * as React from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: Error | string;
  retry?: () => void;
}

export function ErrorState({ error, retry }: ErrorStateProps) {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {retry && (
            <button onClick={retry} className="mt-2 text-sm underline hover:no-underline">
              Try again
            </button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  React.useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
    </Alert>
  );
}
