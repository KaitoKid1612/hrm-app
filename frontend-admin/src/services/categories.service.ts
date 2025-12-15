import { apiClient } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  jobCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export const categoriesService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/admin/categories');
    return response.data;
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/admin/categories/${id}`);
    return response.data;
  },

  // Create category
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post<Category>('/admin/categories', data);
    return response.data;
  },

  // Update category
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await apiClient.patch<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};
