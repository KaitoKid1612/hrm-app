import { applicationsApi } from '@/api/applications.api';
import type { Application, PaginatedResponse, ApplicationStatus } from '@/types';

export interface ApplicationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  jobId?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateApplicationData {
  status?: ApplicationStatus;
  notes?: string;
}

export const applicationsService = {
  async getApplications(params?: ApplicationsQueryParams): Promise<PaginatedResponse<Application>> {
    const response = await applicationsApi.getAll(params);
    return response.data;
  },

  async getApplicationById(id: string): Promise<Application> {
    const response = await applicationsApi.getById(id);
    return response.data;
  },

  async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    const response = await applicationsApi.update(id, data);
    return response.data;
  },

  async deleteApplication(id: string): Promise<void> {
    await applicationsApi.delete(id);
  },

  async changeStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const response = await applicationsApi.changeStatus(id, status);
    return response.data;
  },

  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  }> {
    const response = await applicationsApi.getStats();
    return response.data;
  },
};
