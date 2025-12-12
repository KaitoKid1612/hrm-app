import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export interface CandidateSearchFilters {
  keyword?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  availability?: string;
  page?: number;
  limit?: number;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  city?: string;
  currentJobTitle?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  bio?: string;
  resume?: {
    id: string;
    title: string;
    skills: string[];
    workExperience?: Array<{
      position: string;
      company: string;
      duration: string;
      description?: string;
    }>;
    education?: Array<{
      degree: string;
      school: string;
      year: string;
      major?: string;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      year: string;
    }>;
    updatedAt: string;
  };
}

export const candidateSearchService = {
  async searchCandidates(filters: CandidateSearchFilters) {
    const response = await api.get(API_ENDPOINTS.CANDIDATES.SEARCH, { params: filters });
    return response.data;
  },

  async getCandidateProfile(userId: string) {
    const response = await api.get(API_ENDPOINTS.CANDIDATES.PROFILE(userId));
    return response.data;
  },

  async saveCandidateToPool(candidateId: string) {
    const response = await api.post(API_ENDPOINTS.CANDIDATES.SAVE, { candidateId });
    return response.data;
  },

  async getSavedCandidates() {
    const response = await api.get(API_ENDPOINTS.CANDIDATES.SAVED);
    return response.data;
  },

  async removeSavedCandidate(candidateId: string) {
    const response = await api.delete(API_ENDPOINTS.CANDIDATES.REMOVE_SAVED(candidateId));
    return response.data;
  },
};
