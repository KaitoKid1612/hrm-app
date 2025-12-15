import { apiClient } from '@/lib/api-client';
import type { Company } from '@/types';
import type { PaginatedResponse } from './users.service';

export interface CompaniesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateCompanyData {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export const companiesService = {
  // Get all companies
  async getCompanies(params?: CompaniesQueryParams): Promise<PaginatedResponse<Company>> {
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
  async createCompany(data: Partial<Company>): Promise<Company> {
    const response = await apiClient.post<Company>('/admin/companies', data);
    return response.data;
  },

  // Update company
  async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    const response = await apiClient.patch<Company>(`/admin/companies/${id}`, data);
    return response.data;
  },

  // Delete company
  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/admin/companies/${id}`);
  },

  // Verify company
  async verifyCompany(id: string): Promise<Company> {
    const response = await apiClient.post<Company>(`/admin/companies/${id}/verify`);
    return response.data;
  },

  // Reject company
  async rejectCompany(id: string, reason?: string): Promise<Company> {
    const response = await apiClient.post<Company>(`/admin/companies/${id}/reject`, { reason });
    return response.data;
  },

  // Get company stats
  async getCompanyStats(): Promise<{
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  }> {
    const response = await apiClient.get('/admin/companies/stats');
    return response.data;
  },
};
