import {
  categoriesApi,
  type Category,
  type CreateCategoryData,
  type UpdateCategoryData,
} from '@/api/categories.api';

export type { Category, CreateCategoryData, UpdateCategoryData };

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const response = await categoriesApi.getAll();
    return response.data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await categoriesApi.getById(id);
    return response.data;
  },

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await categoriesApi.create(data);
    return response.data;
  },

  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await categoriesApi.update(id, data);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await categoriesApi.delete(id);
  },
};
