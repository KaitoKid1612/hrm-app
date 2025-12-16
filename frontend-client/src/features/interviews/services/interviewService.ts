import api from '@/lib/axios';
import {
  Interview,
  CreateInterviewDto,
  UpdateInterviewDto,
  InterviewsQuery,
  InterviewsResponse,
} from '../types/interview.types';

const BASE_URL = '/interviews';

export const interviewService = {
  // Create interview
  async createInterview(data: CreateInterviewDto): Promise<Interview> {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Get all interviews with filters
  async getInterviews(query: InterviewsQuery = {}): Promise<InterviewsResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.status) params.append('status', query.status);
    if (query.applicationId) params.append('applicationId', query.applicationId);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await api.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Get upcoming interviews
  async getUpcomingInterviews(): Promise<Interview[]> {
    const response = await api.get(`${BASE_URL}/upcoming`);
    return response.data;
  },

  // Get single interview
  async getInterviewById(id: string): Promise<Interview> {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update interview
  async updateInterview(id: string, data: UpdateInterviewDto): Promise<Interview> {
    const response = await api.patch(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete interview
  async deleteInterview(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};
