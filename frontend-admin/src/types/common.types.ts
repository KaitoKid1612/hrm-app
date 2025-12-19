/**
 * Common types used across the application
 */

// ==================== Pagination ====================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ==================== API Responses ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, unknown>;
}

// ==================== Query Params ====================

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface FilterParams {
  status?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

// ==================== Bulk Actions ====================

export type BulkAction =
  | 'activate'
  | 'deactivate'
  | 'delete'
  | 'verify'
  | 'approve'
  | 'reject'
  | 'feature'
  | 'unfeature'
  | 'publish'
  | 'close'
  | 'archive'
  | 'reopen';

export interface BulkActionRequest {
  ids: string[];
  action: BulkAction;
  reason?: string;
}

export interface BulkActionResponse {
  success: boolean;
  successCount: number;
  failedCount: number;
  message: string;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// ==================== File Upload ====================

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ==================== Table/DataTable ====================

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  render?: (item: T) => React.ReactNode;
}

export interface TableAction<T = unknown> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'ghost' | 'outline';
  disabled?: (item: T) => boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

// ==================== Form Types ====================

export interface FormFieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectOption extends FormFieldOption {
  icon?: React.ReactNode;
  description?: string;
}

// ==================== Modal/Dialog ====================

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

// ==================== Stats & Metrics ====================

export interface Metric {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
}

export interface StatsCard {
  title: string;
  value: number | string;
  change?: number;
  changeText?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
}

// ==================== Chart Data ====================

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

// ==================== Timeline ====================

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
}

// ==================== Notification ====================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string | Date;
  read: boolean;
  actionUrl?: string;
}

// ==================== Filters ====================

export interface Filter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: FormFieldOption[];
  value?: unknown;
  placeholder?: string;
}

export interface ActiveFilter {
  filterId: string;
  value: unknown;
  label?: string;
}

// ==================== Export ====================

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  fields?: string[];
  filters?: Record<string, unknown>;
}

// ==================== Utility Types ====================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ValueOf<T> = T[keyof T];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
  }[Keys];
