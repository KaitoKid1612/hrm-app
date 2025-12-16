import { useState, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';
import {
  JobRecommendation,
  JobRecommendationQuery,
  MatchScoreResponse,
} from '../types/recommendation.types';

export const useJobRecommendations = (query: JobRecommendationQuery = {}) => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await recommendationService.getJobRecommendations(query);
        setRecommendations(data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error?.response?.data?.message || 'Không thể tải gợi ý việc làm');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [query.limit, query.category, query.minMatchScore]);

  return { recommendations, isLoading, error };
};

export const useMatchScore = (jobId: string) => {
  const [matchScore, setMatchScore] = useState<MatchScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchScore = async () => {
      if (!jobId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await recommendationService.getMatchScore({ jobId });
        setMatchScore(data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error?.response?.data?.message || 'Không thể tính điểm phù hợp');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchScore();
  }, [jobId]);

  return { matchScore, isLoading, error };
};

export const useSimilarJobs = (jobId: string, limit = 5) => {
  const [similarJobs, setSimilarJobs] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      if (!jobId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await recommendationService.getSimilarJobs(jobId, limit);
        setSimilarJobs(data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error?.response?.data?.message || 'Không thể tải việc làm tương tự');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarJobs();
  }, [jobId, limit]);

  return { similarJobs, isLoading, error };
};
