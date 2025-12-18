import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export interface ApplicationDetail {
  id: string;
  jobId: string;
  candidateId: string;
  status:
    | 'PENDING'
    | 'REVIEWING'
    | 'SHORTLISTED'
    | 'INTERVIEWED'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'WITHDRAWN';
  coverLetter?: string;
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
  candidate?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  job?: {
    id: string;
    title: string;
    location: string;
  };
  resume?: {
    id: string;
    title: string;
    skills: string[];
    workExperience?: Array<{
      position: string;
      company: string;
      duration: string;
    }>;
    education?: Array<{
      degree: string;
      school: string;
      year: string;
    }>;
  };
}

export const applicationManagementService = {
  async getApplications(params?: {
    jobId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get(API_ENDPOINTS.COMPANIES.APPLICATIONS, { params });
    const data = response.data;

    // Transform backend response to match frontend interface
    // Backend returns 'user', frontend expects 'candidate'
    return Array.isArray(data)
      ? data.map(
          (
            app: ApplicationDetail & {
              user?: { id: string; name: string; email: string; avatar?: string };
            },
          ) => ({
            ...app,
            candidate: app.user
              ? {
                  id: app.user.id,
                  fullName: app.user.name,
                  email: app.user.email,
                  phone: undefined,
                  avatar: app.user.avatar,
                }
              : undefined,
            candidateId: app.user?.id || app.candidateId,
          }),
        )
      : [];
  },

  async getApplicationById(id: string) {
    const response = await api.get(API_ENDPOINTS.APPLICATIONS.DETAIL(id));
    return response.data;
  },

  async updateApplicationStatus(id: string, status: ApplicationDetail['status']) {
    const response = await api.patch(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), { status });
    return response.data;
  },

  async getApplicationsByJob(jobId: string) {
    const response = await api.get(API_ENDPOINTS.COMPANIES.APPLICATIONS, { params: { jobId } });
    return response.data;
  },
};
