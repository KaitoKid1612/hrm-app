// Common shared types across the application

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
