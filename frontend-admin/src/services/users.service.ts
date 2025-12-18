import { apiClient } from '@/lib/api-client';
import type {
  User,
  UserQueryParams,
  UserUpdateData,
  BulkActionRequest,
  PaginatedResponse,
  Stats,
} from '@/types';

export const usersService = {
  // Create new user
  async createUser(data: Partial<User> & { password: string }): Promise<User> {
    const response = await apiClient.post<User>('/admin/users', data);
    return response.data;
  },

  // Get all users with pagination
  async getAllUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  async updateUser(id: string, data: UserUpdateData): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Bulk actions
  async bulkAction(data: BulkActionRequest): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/admin/users/bulk',
      data,
    );
    return response.data;
  },

  // Get user stats
  async getUserStats(): Promise<Stats> {
    const response = await apiClient.get<Stats>('/admin/users/stats/overview');
    return response.data;
  },

  // Toggle user status
  async toggleUserStatus(id: string, status: string): Promise<User> {
    const response = await apiClient.patch<User>(`/admin/users/${id}/status`, { status });
    return response.data;
  },
};
