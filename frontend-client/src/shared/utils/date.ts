/**
 * Format date to Vietnamese locale string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date to short format (dd/mm/yyyy)
 */
export function formatDateShort(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/**
 * Format date with time (dd/mm/yyyy hh:mm)
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format date to locale string
 */
export function formatDateLocale(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
}

/**
 * Format date time to locale string
 */
export function formatDateTimeLocale(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('vi-VN');
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date): boolean {
  return new Date(date) < new Date();
}
