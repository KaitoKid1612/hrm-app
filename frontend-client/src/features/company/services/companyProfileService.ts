import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export interface CompanyProfileData {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  address: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  foundedYear?: number;
  benefits?: string[];
  culture?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export const companyProfileService = {
  async getProfile() {
    const response = await api.get(API_ENDPOINTS.COMPANIES.PROFILE);
    return response.data.data;
  },

  async updateProfile(data: Partial<CompanyProfileData>) {
    const response = await api.patch(API_ENDPOINTS.COMPANIES.PROFILE, data);
    return response.data.data;
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
