import { apiClient } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    jobs: number;
    resumes: number;
  };
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

export const categoriesApi = {
  getAll: () => apiClient.get<{ data: Category[] }>('/admin/categories'),

  getById: (id: string) => apiClient.get<Category>(`/admin/categories/${id}`),

  create: (data: CreateCategoryData) => apiClient.post<Category>('/admin/categories', data),

  update: (id: string, data: UpdateCategoryData) =>
    apiClient.patch<Category>(`/admin/categories/${id}`, data),

  delete: (id: string) => apiClient.delete(`/admin/categories/${id}`),
};
