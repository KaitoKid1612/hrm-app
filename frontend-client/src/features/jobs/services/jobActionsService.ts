import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export interface ApplyJobData {
  jobId: string;
  resumeId?: string;
  coverLetter?: string;
}

export const applicationService = {
  async applyJob(data: ApplyJobData) {
    const response = await api.post(API_ENDPOINTS.APPLICATIONS.CREATE, data);
    return response.data;
  },

  async getMyApplications() {
    const response = await api.get(API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS);
    return response.data.data;
  },

  async checkIfApplied(jobId: string): Promise<boolean> {
    try {
      const applications = await this.getMyApplications();
      return applications.some((app: { jobId: string }) => app.jobId === jobId);
    } catch {
      return false;
    }
  },
};

export const savedJobsService = {
  async saveJob(jobId: string) {
    const response = await api.post(API_ENDPOINTS.SAVED_JOBS.SAVE, { jobId });
    return response.data;
  },

  async unsaveJob(id: string) {
    const response = await api.delete(API_ENDPOINTS.SAVED_JOBS.UNSAVE(id));
    return response.data;
  },

  async getMySavedJobs(page = 1, limit = 20) {
    const response = await api.get(API_ENDPOINTS.SAVED_JOBS.LIST, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async checkIfSaved(jobId: string): Promise<boolean> {
    try {
      const response = await api.get(API_ENDPOINTS.SAVED_JOBS.CHECK(jobId));
      return response.data.data.isSaved;
    } catch {
      return false;
    }
  },

  async getSavedJobIds(): Promise<string[]> {
    try {
      const response = await api.get(API_ENDPOINTS.SAVED_JOBS.IDS);
      return response.data.data;
    } catch {
      return [];
    }
  },
};
