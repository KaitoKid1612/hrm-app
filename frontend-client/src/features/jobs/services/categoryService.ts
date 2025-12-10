import api from '@/lib/axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  jobCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
