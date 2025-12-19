import { apiClient } from '@/lib/api-client';
import type {
  Company,
  CompanyQueryParams,
  CompanyUpdateData,
  BulkActionRequest,
  PaginatedResponse,
} from '@/types';

export const companiesApi = {
  getAll: (params?: CompanyQueryParams) =>
    apiClient.get<PaginatedResponse<Company>>('/admin/companies', { params }),

  getById: (id: string) => apiClient.get<Company>(`/admin/companies/${id}`),

  create: (data: CompanyUpdateData) => apiClient.post<Company>('/admin/companies', data),

  update: (id: string, data: CompanyUpdateData) =>
    apiClient.put<Company>(`/admin/companies/${id}`, data),

  delete: (id: string) => apiClient.delete(`/admin/companies/${id}`),

  bulkAction: (data: BulkActionRequest) =>
    apiClient.post<{ success: boolean; message: string }>('/admin/companies/bulk', data),

  verify: (id: string) => apiClient.post<Company>(`/admin/companies/${id}/verify`),

  toggleFeature: (id: string, isFeatured: boolean) =>
    apiClient.patch<Company>(`/admin/companies/${id}`, { isFeatured }),

  getStats: () =>
    apiClient.get<{
      total: number;
      verified: number;
      featured: number;
      pending: number;
    }>('/admin/companies/stats/overview'),
};
