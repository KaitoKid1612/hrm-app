import api from '@/lib/axios';
import { Job, JobSearchParams } from '../types';

export interface JobStatistics {
  totalJobs: number;
  totalCompanies: number;
  totalCandidates: number;
  totalApplications: number;
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const jobService = {
  /**
   * Get all jobs with filters
   */
  async getJobs(params?: JobSearchParams): Promise<JobsResponse> {
    const response = await api.get('/jobs/search/all', { params });
    return response.data;
  },

  /**
   * Get job by ID
   */
  async getJobById(id: string): Promise<Job> {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Get trending/hot jobs
   */
  async getTrendingJobs(limit: number = 6): Promise<Job[]> {
    const response = await api.get('/jobs/search/trending', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get job statistics for homepage
   */
  async getJobStatistics(): Promise<JobStatistics> {
    const response = await api.get('/jobs/search/statistics');
    return response.data;
  },

  /**
   * Get similar jobs
   */
  async getSimilarJobs(id: string, limit: number = 5): Promise<Job[]> {
    const response = await api.get(`/jobs/${id}/similar`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Search jobs with keyword
   */
  async searchJobs(keyword: string, location?: string): Promise<JobsResponse> {
    const response = await api.get('/jobs/search/all', {
      params: {
        keyword,
        city: location,
        limit: 20,
      },
    });
    return response.data;
  },

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    const response = await api.get('/jobs/search/suggestions', {
      params: { query, limit },
    });
    return response.data;
  },
};
