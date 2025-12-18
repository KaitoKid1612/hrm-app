/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format salary range
 */
export function formatSalaryRange(min?: number, max?: number): string {
  if (!min && !max) return 'Thỏa thuận';
  if (!max) return `Từ ${formatCurrency(min!)}`;
  if (!min) return `Đến ${formatCurrency(max)}`;
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

/**
 * Parse salary string to number
 */
export function parseSalary(salary: string): number {
  // Remove currency symbols and parse
  const cleaned = salary.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10);
}
