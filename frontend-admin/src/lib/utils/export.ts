// Utility functions for data export
export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  mapper: (item: T) => (string | number | boolean | null | undefined)[],
): string => {
  const rows = data.map(mapper);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};

export const exportToJSON = <T>(data: T): string => {
  return JSON.stringify(data, null, 2);
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Error handler utility
export const getErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message || 'An error occurred';
};

// Form data extractor
export const extractFormData = <T extends Record<string, unknown>>(
  formData: FormData,
  schema: Record<keyof T, 'string' | 'number' | 'boolean'>,
): T => {
  const result = {} as T;

  for (const [key, type] of Object.entries(schema)) {
    const value = formData.get(key as string);

    if (type === 'number') {
      result[key as keyof T] = (value ? parseInt(value as string, 10) : undefined) as T[keyof T];
    } else if (type === 'boolean') {
      result[key as keyof T] = (value === 'on') as T[keyof T];
    } else {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
};
