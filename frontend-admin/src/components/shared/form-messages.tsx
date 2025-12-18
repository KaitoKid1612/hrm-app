import * as React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function FormError({ message, className, ...props }: FormErrorProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" className={cn('mt-2', className)} {...props}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

interface FormSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function FormSuccess({ message, className, ...props }: FormSuccessProps) {
  if (!message) return null;

  return (
    <Alert
      className={cn('mt-2 border-green-500 bg-green-50 dark:bg-green-900/20', className)}
      {...props}
    >
      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
    </Alert>
  );
}

interface FormFieldErrorProps {
  error?: string;
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error) return null;

  return (
    <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-1">
      <X className="h-3 w-3" />
      {error}
    </p>
  );
}
