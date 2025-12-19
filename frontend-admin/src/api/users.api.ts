import { apiClient } from '@/lib/api-client';
import type {
  User,
  UserQueryParams,
  UserUpdateData,
  BulkActionRequest,
  PaginatedResponse,
  UserStats,
} from '@/types';

export const usersApi = {
  create: (data: Partial<User> & { password: string }) =>
    apiClient.post<User>('/admin/users', data),

  getAll: (params?: UserQueryParams) =>
    apiClient.get<PaginatedResponse<User>>('/admin/users', { params }),

  getById: (id: string) => apiClient.get<User>(`/admin/users/${id}`),

  update: (id: string, data: UserUpdateData) => apiClient.put<User>(`/admin/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/admin/users/${id}`),

  bulkAction: (data: BulkActionRequest) =>
    apiClient.post<{ success: boolean; message: string }>('/admin/users/bulk', data),

  getStats: () => apiClient.get<UserStats>('/admin/users/stats/overview'),

  toggleStatus: (id: string, status: string) =>
    apiClient.patch<User>(`/admin/users/${id}/status`, { status }),
};
