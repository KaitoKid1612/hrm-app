import api from '@/lib/axios';
import {
  JobRecommendation,
  JobRecommendationQuery,
  CandidateRecommendation,
  CandidateRecommendationQuery,
  MatchScoreRequest,
  MatchScoreResponse,
} from '../types/recommendation.types';

const BASE_URL = '/recommendations';

export const recommendationService = {
  // Get job recommendations for current candidate
  async getJobRecommendations(query: JobRecommendationQuery = {}): Promise<JobRecommendation[]> {
    const params = new URLSearchParams();
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.category) params.append('category', query.category);
    if (query.minMatchScore) params.append('minMatchScore', query.minMatchScore.toString());

    const response = await api.get(`${BASE_URL}/jobs?${params.toString()}`);
    return response.data.data || response.data; // Handle both { data: [] } and direct array
  },

  // Get candidate recommendations for a job (Employer only)
  async getCandidateRecommendations(
    query: CandidateRecommendationQuery,
  ): Promise<CandidateRecommendation[]> {
    const params = new URLSearchParams();
    params.append('jobId', query.jobId);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.minMatchScore) params.append('minMatchScore', query.minMatchScore.toString());

    const response = await api.get(`${BASE_URL}/candidates?${params.toString()}`);
    return response.data.data || response.data; // Handle both { data: [] } and direct array
  },

  // Calculate match score for a specific job
  async getMatchScore(data: MatchScoreRequest): Promise<MatchScoreResponse> {
    const response = await api.post(`${BASE_URL}/match-score`, data);
    return response.data;
  },

  // Get similar jobs
  async getSimilarJobs(jobId: string, limit = 5): Promise<JobRecommendation[]> {
    const response = await api.get(`${BASE_URL}/similar/${jobId}?limit=${limit}`);
    return response.data.data || response.data; // Handle both { data: [] } and direct array
  },
};
