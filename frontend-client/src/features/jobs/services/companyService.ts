import api from '@/lib/axios';

export type CompanyType = 'COMPANY' | 'SMALL_BUSINESS' | 'HEADHUNTER';

export interface Company {
  id: string;
  name: string;
  type?: CompanyType;
  logo?: string;
  description?: string;
  website?: string;
  city?: string;
  address?: string;
  size?: string;
  industry?: string;
  jobCount?: number;
  createdAt: string;
}

export const companyService = {
  /**
   * Get all companies
   */
  async getCompanies(): Promise<Company[]> {
    const response = await api.get('/companies');
    return response.data;
  },

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  /**
   * Get top companies (with most jobs)
   */
  async getTopCompanies(limit: number = 6): Promise<Company[]> {
    const response = await api.get('/companies', {
      params: { limit, sort: 'jobCount' },
    });
    return response.data;
  },
};
