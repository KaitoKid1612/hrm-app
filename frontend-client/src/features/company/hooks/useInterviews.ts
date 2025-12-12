import { useState, useEffect, useCallback } from 'react';
import { interviewService } from '../services/interviewService';
import {
  Interview,
  CreateInterviewData,
  UpdateInterviewData,
  InterviewFilters,
} from '../types/interview.types';

export const useInterviews = (filters?: InterviewFilters) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await interviewService.getAll(filters);
      setInterviews(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch interviews');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const createInterview = async (data: CreateInterviewData) => {
    try {
      setError(null);
      const newInterview = await interviewService.create(data);
      setInterviews((prev) => [...prev, newInterview]);
      return newInterview;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = error.response?.data?.message || 'Failed to create interview';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateInterview = async (id: string, data: UpdateInterviewData) => {
    try {
      setError(null);
      const updated = await interviewService.update(id, data);
      setInterviews((prev) => prev.map((interview) => (interview.id === id ? updated : interview)));
      return updated;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = error.response?.data?.message || 'Failed to update interview';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      setError(null);
      await interviewService.delete(id);
      setInterviews((prev) => prev.filter((interview) => interview.id !== id));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = error.response?.data?.message || 'Failed to delete interview';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    interviews,
    isLoading,
    error,
    fetchInterviews,
    createInterview,
    updateInterview,
    deleteInterview,
  };
};

export const useUpcomingInterviews = (limit: number = 10) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcoming = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await interviewService.getUpcoming(limit);
      setInterviews(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch upcoming interviews');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  return { interviews, isLoading, error, refetch: fetchUpcoming };
};
