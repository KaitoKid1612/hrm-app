import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { ProfileFormData, ProfileUpdateResponse } from '../types';

export const profileService = {
  async getProfile() {
    const response = await api.get(API_ENDPOINTS.PROFILE.GET);
    return response.data.data;
  },

  async updateProfile(data: ProfileFormData): Promise<ProfileUpdateResponse> {
    const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
