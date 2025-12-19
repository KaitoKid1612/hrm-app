import { companiesApi } from '@/api/companies.api';
import type {
  Company,
  CompanyQueryParams,
  CompanyUpdateData,
  BulkActionRequest,
  PaginatedResponse,
} from '@/types';

export const companiesService = {
  async getAllCompanies(params?: CompanyQueryParams): Promise<PaginatedResponse<Company>> {
    const response = await companiesApi.getAll(params);
    return response.data;
  },

  async getCompanyById(id: string): Promise<Company> {
    const response = await companiesApi.getById(id);
    return response.data;
  },

  async createCompany(data: CompanyUpdateData): Promise<Company> {
    const response = await companiesApi.create(data);
    return response.data;
  },

  async updateCompany(id: string, data: CompanyUpdateData): Promise<Company> {
    const response = await companiesApi.update(id, data);
    return response.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await companiesApi.delete(id);
  },

  async bulkAction(data: BulkActionRequest): Promise<{ success: boolean; message: string }> {
    const response = await companiesApi.bulkAction(data);
    return response.data;
  },

  async verifyCompany(id: string): Promise<Company> {
    const response = await companiesApi.verify(id);
    return response.data;
  },

  async toggleFeature(id: string, isFeatured: boolean): Promise<Company> {
    const response = await companiesApi.toggleFeature(id, isFeatured);
    return response.data;
  },

  async getCompanyStats(): Promise<{
    total: number;
    verified: number;
    featured: number;
    pending: number;
  }> {
    const response = await companiesApi.getStats();
    return response.data;
  },
};
