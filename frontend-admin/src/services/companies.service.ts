import { apiClient } from '@/lib/api-client';
import type {
  Company,
  CompanyQueryParams,
  CompanyUpdateData,
  BulkActionRequest,
  PaginatedResponse,
} from '@/types';

export const companiesService = {
  // Get all companies
  async getAllCompanies(params?: CompanyQueryParams): Promise<PaginatedResponse<Company>> {
    const response = await apiClient.get<PaginatedResponse<Company>>('/admin/companies', {
      params,
    });
    return response.data;
  },

  // Get company by ID
  async getCompanyById(id: string): Promise<Company> {
    const response = await apiClient.get<Company>(`/admin/companies/${id}`);
    return response.data;
  },

  // Create company
  async createCompany(data: CompanyUpdateData): Promise<Company> {
    const response = await apiClient.post<Company>('/admin/companies', data);
    return response.data;
  },

  // Update company
  async updateCompany(id: string, data: CompanyUpdateData): Promise<Company> {
    const response = await apiClient.put<Company>(`/admin/companies/${id}`, data);
    return response.data;
  },

  // Delete company
  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/admin/companies/${id}`);
  },

  // Bulk actions
  async bulkAction(data: BulkActionRequest): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/admin/companies/bulk',
      data,
    );
    return response.data;
  },

  // Verify company
  async verifyCompany(id: string): Promise<Company> {
    const response = await apiClient.post<Company>(`/admin/companies/${id}/verify`);
    return response.data;
  },

  // Feature/unfeature company
  async toggleFeature(id: string, isFeatured: boolean): Promise<Company> {
    const response = await apiClient.patch<Company>(`/admin/companies/${id}`, { isFeatured });
    return response.data;
  },

  // Get company stats
  async getCompanyStats(): Promise<{
    total: number;
    verified: number;
    featured: number;
    pending: number;
  }> {
    const response = await apiClient.get('/admin/companies/stats/overview');
    return response.data;
  },
};
