import { usersApi } from '@/api/users.api';
import type {
  User,
  UserQueryParams,
  UserUpdateData,
  BulkActionRequest,
  PaginatedResponse,
  UserStats,
} from '@/types';

export const usersService = {
  async createUser(data: Partial<User> & { password: string }): Promise<User> {
    const response = await usersApi.create(data);
    return response.data;
  },

  async getAllUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    const response = await usersApi.getAll(params);
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await usersApi.getById(id);
    return response.data;
  },

  async updateUser(id: string, data: UserUpdateData): Promise<User> {
    const response = await usersApi.update(id, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await usersApi.delete(id);
  },

  async bulkAction(data: BulkActionRequest): Promise<{ success: boolean; message: string }> {
    const response = await usersApi.bulkAction(data);
    return response.data;
  },

  async getUserStats(): Promise<UserStats> {
    const response = await usersApi.getStats();
    return response.data;
  },

  async toggleUserStatus(id: string, status: string): Promise<User> {
    const response = await usersApi.toggleStatus(id, status);
    return response.data;
  },
};
