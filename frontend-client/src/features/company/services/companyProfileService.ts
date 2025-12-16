import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export type CompanyType = 'COMPANY' | 'SMALL_BUSINESS' | 'HEADHUNTER';

export interface CompanyProfileData {
  id?: string;
  name: string;
  type?: CompanyType;
  description?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  size?: string;
  taxCode?: string;
  isVerified?: boolean;
  industry?: string;
  foundedYear?: number;
  culture?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  benefits?: string[];
}

export interface CreateCompanyData {
  name: string;
  type?: CompanyType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  description?: string;
  website?: string;
  size?: string;
}

export const companyProfileService = {
  async getMyProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.COMPANY.MY_PROFILE);
      return response.data;
    } catch (error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createCompany(data: CreateCompanyData) {
    const response = await api.post(API_ENDPOINTS.COMPANY.CREATE, data);
    return response.data;
  },

  async updateProfile(id: string, data: Partial<CompanyProfileData>) {
    const response = await api.put(API_ENDPOINTS.COMPANY.UPDATE(id), data);
    return response.data;
  },

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ENDPOINTS.UPLOAD.COMPANY_LOGO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
