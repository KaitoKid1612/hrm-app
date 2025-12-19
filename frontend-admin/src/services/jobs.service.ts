import { jobsApi } from '@/api/jobs.api';
import type {
  Job,
  PaginatedResponse,
  BulkActionRequest,
  WorkMode,
  JobType,
  JobLevel,
  SalaryType,
  ExperienceLevel,
} from '@/types';

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  companyId?: string;
  categoryId?: string;
  level?: string;
  type?: string;
  isHot?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  niceToHave?: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  workMode?: WorkMode;
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  salaryCurrency?: string;
  showSalary?: boolean;
  type?: JobType;
  level?: JobLevel;
  experienceLevel?: ExperienceLevel;
  positions?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  isHot?: boolean;
  isActive?: boolean;
  deadline?: string;
  companyId?: string;
  categoryId?: string;
  skillIds?: string[];
}

export const jobsService = {
  async getAllJobs(params?: JobsQueryParams): Promise<PaginatedResponse<Job>> {
    const response = await jobsApi.getAll(params);
    return response.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await jobsApi.getById(id);
    return response.data;
  },

  async createJob(data: UpdateJobData): Promise<Job> {
    const response = await jobsApi.create(data);
    return response.data;
  },

  async updateJob(id: string, data: UpdateJobData): Promise<Job> {
    const response = await jobsApi.update(id, data);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await jobsApi.delete(id);
  },

  async closeJob(id: string): Promise<Job> {
    const response = await jobsApi.close(id);
    return response.data;
  },

  async reopenJob(id: string): Promise<Job> {
    const response = await jobsApi.reopen(id);
    return response.data;
  },

  async bulkAction(data: BulkActionRequest): Promise<{ success: boolean; message: string }> {
    const response = await jobsApi.bulkAction(data);
    return response.data;
  },

  async getJobStats(): Promise<{
    total: number;
    published: number;
    closed: number;
    draft: number;
  }> {
    const response = await jobsApi.getStats();
    return response.data;
  },
};
