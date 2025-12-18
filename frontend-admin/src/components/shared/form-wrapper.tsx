'use client';

import * as React from 'react';
import { useForm, UseFormReturn, SubmitHandler, FieldValues, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { FormError, FormSuccess } from './form-messages';

/**
 * Form wrapper component with built-in validation using react-hook-form + Zod
 */

interface FormProps<T extends FieldValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> {
  schema?: z.ZodType<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  onSubmit: SubmitHandler<T>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  mode?: UseFormProps<T>['mode'];
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  errorMessage,
  successMessage,
  mode = 'onSubmit',
  className,
  ...props
}: FormProps<T>) {
  const form = useForm<T>({
    // @ts-expect-error - Zod v4 type incompatibility with react-hook-form resolver
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
  });

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit={form.handleSubmit(onSubmit as any)}
      className={cn('space-y-4', className)}
      {...props}
    >
      {errorMessage && <FormError message={errorMessage} />}
      {successMessage && <FormSuccess message={successMessage} />}

      {/* @ts-expect-error - Generic type constraint issue with UseFormReturn */}
      {children(form)}
    </form>
  );
}

/**
 * Form Field component
 */
interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
}

export function FormField({
  label,
  error,
  required,
  htmlFor,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm font-medium text-destructive mt-1">{error}</p>}
    </div>
  );
}

/**
 * Form Section component (for grouping fields)
 */
interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Form Actions component (for submit/cancel buttons)
 */
interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
}

export function FormActions({ align = 'right', children, className, ...props }: FormActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={cn('flex gap-3 pt-4', alignmentClasses[align], className)} {...props}>
      {children}
    </div>
  );
}
