import { apiClient } from '@/lib/api-client';
import type { Job, PaginatedResponse } from '@/types';

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  companyId?: string;
  categoryId?: string;
  level?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  salary?: string;
  location?: string;
  type?: string;
  level?: string;
  status?: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}

export const jobsService = {
  // Get all jobs
  async getJobs(params?: JobsQueryParams): Promise<PaginatedResponse<Job>> {
    const response = await apiClient.get<PaginatedResponse<Job>>('/jobs', { params });
    return response.data;
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Create job
  async createJob(data: Partial<Job>): Promise<Job> {
    const response = await apiClient.post<Job>('/jobs', data);
    return response.data;
  },

  // Update job
  async updateJob(id: string, data: UpdateJobData): Promise<Job> {
    const response = await apiClient.patch<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  // Delete job
  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },

  // Close job
  async closeJob(id: string): Promise<Job> {
    const response = await apiClient.patch<Job>(`/jobs/${id}/close`);
    return response.data;
  },

  // Reopen job
  async reopenJob(id: string): Promise<Job> {
    const response = await apiClient.patch<Job>(`/jobs/${id}/reopen`);
    return response.data;
  },

  // Get job stats
  async getJobStats(): Promise<{
    total: number;
    active: number;
    closed: number;
    draft: number;
  }> {
    const response = await apiClient.get('/jobs/stats');
    return response.data;
  },
};
