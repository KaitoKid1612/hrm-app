import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { z } from 'zod';

/**
 * Form utilities and helpers for react-hook-form
 */

/**
 * Extract error message from form field
 */
export function getFormError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>,
): string | undefined {
  const error = form.formState.errors[fieldName];
  return error?.message as string | undefined;
}

/**
 * Check if form field has error
 */
export function hasFormError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>,
): boolean {
  return !!form.formState.errors[fieldName];
}

/**
 * Get field props for form inputs (common attributes)
 */
export function getFieldProps<T extends FieldValues>(form: UseFormReturn<T>, fieldName: Path<T>) {
  return {
    ...form.register(fieldName),
    error: getFormError(form, fieldName),
    invalid: hasFormError(form, fieldName),
  };
}

/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convert File to data URL for preview
 */
export function getFilePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Parse form data with Zod schema
 */
export function parseFormData<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe parse form data with Zod schema (returns error instead of throwing)
 */
export function safeParseFormData<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

/**
 * Convert Zod error to form errors object
 */
export function zodErrorToFormErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue: z.ZodIssue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return errors;
}

/**
 * Reset form to default values
 */
export function resetFormWithDefaults<T extends FieldValues>(
  form: UseFormReturn<T>,
  defaults: T,
): void {
  form.reset(defaults);
}

/**
 * Disable form submission on Enter key (useful for multi-step forms)
 */
export function preventEnterSubmit(event: React.KeyboardEvent<HTMLFormElement>): void {
  if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
    event.preventDefault();
  }
}

/**
 * Handle form submission with error handling
 */
export async function handleFormSubmit<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: (data: T) => Promise<void>,
  onError?: (error: Error) => void,
): Promise<void> {
  try {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    await onSubmit(data);
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    } else {
      throw error;
    }
  }
}

/**
 * Set multiple form errors at once
 */
export function setFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: Partial<Record<Path<T>, string>>,
): void {
  Object.entries(errors).forEach(([field, message]) => {
    form.setError(field as Path<T>, {
      type: 'manual',
      message: message as string,
    });
  });
}

/**
 * Clear all form errors
 */
export function clearFormErrors<T extends FieldValues>(form: UseFormReturn<T>): void {
  form.clearErrors();
}

/**
 * Mark all fields as touched (useful for showing all validation errors)
 */
export async function touchAllFields<T extends FieldValues>(
  form: UseFormReturn<T>,
): Promise<boolean> {
  return await form.trigger();
}
