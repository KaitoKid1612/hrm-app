import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Resume, ResumeFormData } from '../types/resume';

export const resumeService = {
  async getMyResume(): Promise<Resume | null> {
    try {
      const response = await api.get(API_ENDPOINTS.RESUME.MY_RESUME);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  async upsertResume(data: ResumeFormData): Promise<Resume> {
    const response = await api.post(API_ENDPOINTS.RESUME.UPSERT, data);
    return response.data;
  },

  async uploadResumeFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
