import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from './users.service';

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  feedback?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
    };
    job: {
      id: string;
      title: string;
      company: {
        id: string;
        name: string;
        logo?: string;
      };
    };
  };
}

export interface InterviewsQueryParams {
  page?: number;
  limit?: number;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  applicationId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateInterviewData {
  scheduledAt?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  feedback?: string;
}

export const interviewsService = {
  // Get all interviews
  async getInterviews(params?: InterviewsQueryParams): Promise<PaginatedResponse<Interview>> {
    const response = await apiClient.get<PaginatedResponse<Interview>>('/admin/interviews', {
      params,
    });
    return response.data;
  },

  // Get interview by ID
  async getInterviewById(id: string): Promise<Interview> {
    const response = await apiClient.get<Interview>(`/admin/interviews/${id}`);
    return response.data;
  },

  // Update interview
  async updateInterview(id: string, data: UpdateInterviewData): Promise<Interview> {
    const response = await apiClient.patch<Interview>(`/admin/interviews/${id}`, data);
    return response.data;
  },

  // Delete interview
  async deleteInterview(id: string): Promise<void> {
    await apiClient.delete(`/admin/interviews/${id}`);
  },

  // Change interview status
  async changeStatus(
    id: string,
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW',
    feedback?: string,
  ): Promise<Interview> {
    const response = await apiClient.patch<Interview>(`/admin/interviews/${id}/status`, {
      status,
      feedback,
    });
    return response.data;
  },

  // Get interview stats
  async getInterviewStats(): Promise<{
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> {
    const response = await apiClient.get('/admin/interviews/stats/overview');
    return response.data;
  },
};
