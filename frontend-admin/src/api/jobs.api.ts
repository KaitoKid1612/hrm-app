/**
 * API Layer - Pure HTTP calls
 * No business logic, just API communication
 */

import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse, Job } from '@/types';

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  companyId?: string;
  categoryId?: string;
  level?: string;
  type?: string;
  isHot?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const jobsApi = {
  getAll: (params?: JobsQueryParams) =>
    apiClient.get<PaginatedResponse<Job>>('/admin/jobs', { params }),

  getById: (id: string) => apiClient.get<Job>(`/admin/jobs/${id}`),

  create: (data: Partial<Job>) => apiClient.post<Job>('/admin/jobs', data),

  update: (id: string, data: Partial<Job>) => apiClient.put<Job>(`/admin/jobs/${id}`, data),

  delete: (id: string) => apiClient.delete(`/admin/jobs/${id}`),

  close: (id: string) => apiClient.post<Job>(`/admin/jobs/${id}/close`),

  reopen: (id: string) => apiClient.post<Job>(`/admin/jobs/${id}/reopen`),

  getStats: () =>
    apiClient.get<{
      total: number;
      published: number;
      draft: number;
      closed: number;
    }>('/admin/jobs/stats/overview'),

  bulkAction: (data: { action: string; ids: string[] }) => apiClient.post('/admin/jobs/bulk', data),
};
