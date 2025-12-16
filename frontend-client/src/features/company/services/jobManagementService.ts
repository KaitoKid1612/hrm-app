import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Job as JobType } from '@/features/jobs/types';

export type CompanyType = 'COMPANY' | 'SMALL_BUSINESS' | 'HEADHUNTER';

export interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  level: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEAD';
  numberOfPositions: number;
  expiresAt: string;
  isHot?: boolean;
  categoryId?: string;
  skillIds?: string[];
  // Optional: If provided, job will be linked to existing company
  companyId?: string;
  // Type of company to auto-create if companyId is not provided
  companyType?: CompanyType;
}

export interface Job extends JobFormData {
  id: string;
  companyId: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  applications?: number;
  views?: number;
}

export const jobManagementService = {
  async createJob(data: JobFormData) {
    const response = await api.post(API_ENDPOINTS.JOBS.CREATE, data);
    return response.data.data;
  },

  async updateJob(id: string, data: Partial<JobFormData>) {
    const response = await api.patch(API_ENDPOINTS.JOBS.UPDATE(id), data);
    return response.data.data;
  },

  async deleteJob(id: string) {
    const response = await api.delete(API_ENDPOINTS.JOBS.DELETE(id));
    return response.data;
  },

  async getMyJobs(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get(API_ENDPOINTS.JOBS.MY_JOBS, { params });

    // Transform backend data to match frontend interface
    const transformedData =
      response.data.data?.map((job: JobType) => ({
        ...job,
        salary: {
          min: job.salaryMin || 0,
          max: job.salaryMax || 0,
          currency: 'VND',
        },
        location: job.city || job.address || 'Chưa cập nhật',
        numberOfPositions: job.positions || 1,
        expiresAt: job.deadline || job.createdAt,
        status: job.isActive ? 'ACTIVE' : 'CLOSED',
        applications: 0,
        views: job.viewCount || 0,
      })) || [];

    return {
      data: transformedData,
      meta: response.data.meta,
    };
  },

  async getJobById(id: string) {
    const response = await api.get(API_ENDPOINTS.JOBS.DETAIL(id));
    return response.data.data;
  },

  async closeJob(id: string) {
    const response = await api.patch(API_ENDPOINTS.JOBS.UPDATE(id), { status: 'CLOSED' });
    return response.data.data;
  },

  async reopenJob(id: string) {
    const response = await api.patch(API_ENDPOINTS.JOBS.UPDATE(id), { status: 'ACTIVE' });
    return response.data.data;
  },
};
