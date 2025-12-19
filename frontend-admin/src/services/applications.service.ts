import { apiClient } from '@/lib/api-client';
import type { Application, PaginatedResponse } from '@/types';

export interface ApplicationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  jobId?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateApplicationData {
  status?: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
}

export const applicationsService = {
  // Get all applications
  async getApplications(params?: ApplicationsQueryParams): Promise<PaginatedResponse<Application>> {
    const response = await apiClient.get<PaginatedResponse<Application>>('/admin/applications', {
      params,
    });
    return response.data;
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application> {
    const response = await apiClient.get<Application>(`/admin/applications/${id}`);
    return response.data;
  },

  // Update application
  async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    const response = await apiClient.patch<Application>(`/admin/applications/${id}`, data);
    return response.data;
  },

  // Delete application
  async deleteApplication(id: string): Promise<void> {
    await apiClient.delete(`/admin/applications/${id}`);
  },

  // Change application status
  async changeStatus(
    id: string,
    status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<Application> {
    const response = await apiClient.patch<Application>(`/admin/applications/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Get application stats
  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  }> {
    const response = await apiClient.get('/admin/applications/stats/overview');
    return response.data;
  },
};
