import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobFilterQuery extends PaginationQuery {
  categoryId?: string;
  jobType?: string;
  jobLevel?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  keyword?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
