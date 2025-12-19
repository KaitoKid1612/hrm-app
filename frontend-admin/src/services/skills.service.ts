import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types';

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    jobs: number;
    resumes: number;
  };
}

export interface SkillsQueryParams {
  page?: number;
  limit?: number;
}

export interface CreateSkillData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateSkillData {
  name?: string;
  slug?: string;
  description?: string;
}

export const skillsService = {
  // Get all skills
  async getSkills(params?: SkillsQueryParams): Promise<PaginatedResponse<Skill>> {
    const response = await apiClient.get<PaginatedResponse<Skill>>('/admin/skills', { params });
    return response.data;
  },

  // Get skill by ID
  async getSkillById(id: string): Promise<Skill> {
    const response = await apiClient.get<Skill>(`/admin/skills/${id}`);
    return response.data;
  },

  // Create skill
  async createSkill(data: CreateSkillData): Promise<Skill> {
    const response = await apiClient.post<Skill>('/admin/skills', data);
    return response.data;
  },

  // Update skill
  async updateSkill(id: string, data: UpdateSkillData): Promise<Skill> {
    const response = await apiClient.patch<Skill>(`/admin/skills/${id}`, data);
    return response.data;
  },

  // Delete skill
  async deleteSkill(id: string): Promise<void> {
    await apiClient.delete(`/admin/skills/${id}`);
  },
};
