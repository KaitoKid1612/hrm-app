import { Job } from '@/features/jobs/types';

export interface JobRecommendation extends Job {
  matchScore?: number;
  matchReasons?: string[];
}

export interface JobRecommendationQuery {
  limit?: number;
  category?: string;
  minMatchScore?: number;
}

export interface CandidateRecommendation {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  currentJobTitle?: string;
  city?: string;
  matchScore: number;
  matchReasons: string[];
  skills: Array<{
    id: string;
    name: string;
  }>;
  resume?: {
    id: string;
    experience: string;
    education?: string;
  };
}

export interface CandidateRecommendationQuery {
  jobId: string;
  limit?: number;
  minMatchScore?: number;
}

export interface MatchScoreRequest {
  jobId: string;
}

export interface MatchScoreResponse {
  jobId: string;
  matchScore: number;
  matchReasons: string[];
  missingSkills: string[];
  recommendations: string[];
}
