import { apiClient } from '@/lib/api-client';
import type { Application, PaginatedResponse, ApplicationStatus } from '@/types';

export interface ApplicationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  jobId?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateApplicationData {
  status?: ApplicationStatus;
  notes?: string;
}

export const applicationsApi = {
  getAll: (params?: ApplicationsQueryParams) =>
    apiClient.get<PaginatedResponse<Application>>('/admin/applications', { params }),

  getById: (id: string) => apiClient.get<Application>(`/admin/applications/${id}`),

  update: (id: string, data: UpdateApplicationData) =>
    apiClient.patch<Application>(`/admin/applications/${id}`, data),

  delete: (id: string) => apiClient.delete(`/admin/applications/${id}`),

  changeStatus: (id: string, status: ApplicationStatus) =>
    apiClient.patch<Application>(`/admin/applications/${id}/status`, { status }),

  getStats: () =>
    apiClient.get<{
      total: number;
      pending: number;
      reviewing: number;
      accepted: number;
      rejected: number;
    }>('/admin/applications/stats/overview'),
};
