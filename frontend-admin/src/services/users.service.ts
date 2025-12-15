import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  status?: string;
}

export const usersService = {
  // Get all users with pagination
  async getUsers(params?: UsersQueryParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  // Create user
  async createUser(data: Partial<User>): Promise<User> {
    const response = await apiClient.post<User>('/admin/users', data);
    return response.data;
  },

  // Update user
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.patch<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Ban/Unban user
  async toggleUserStatus(id: string, status: 'ACTIVE' | 'BANNED'): Promise<User> {
    const response = await apiClient.patch<User>(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Get user stats
  async getUserStats(): Promise<{
    total: number;
    candidates: number;
    employers: number;
    admins: number;
    active: number;
    banned: number;
  }> {
    const response = await apiClient.get('/admin/users/stats');
    return response.data;
  },
};
