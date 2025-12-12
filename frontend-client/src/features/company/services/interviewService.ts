import api from '@/lib/axios';
import {
  Interview,
  CreateInterviewData,
  UpdateInterviewData,
  InterviewFilters,
} from '../types/interview.types';

const INTERVIEWS_BASE = '/interviews';

export const interviewService = {
  async getAll(filters?: InterviewFilters): Promise<Interview[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);

    const response = await api.get(`${INTERVIEWS_BASE}?${params.toString()}`);
    return response.data;
  },

  async getUpcoming(limit: number = 10): Promise<Interview[]> {
    const response = await api.get(`${INTERVIEWS_BASE}/upcoming?limit=${limit}`);
    return response.data;
  },

  async getById(id: string): Promise<Interview> {
    const response = await api.get(`${INTERVIEWS_BASE}/${id}`);
    return response.data;
  },

  async create(data: CreateInterviewData): Promise<Interview> {
    const response = await api.post(INTERVIEWS_BASE, data);
    return response.data;
  },

  async update(id: string, data: UpdateInterviewData): Promise<Interview> {
    const response = await api.patch(`${INTERVIEWS_BASE}/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${INTERVIEWS_BASE}/${id}`);
  },
};
