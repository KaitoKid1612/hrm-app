import { useState, useEffect } from 'react';
import { interviewService } from '../services/interviewService';
import { Interview, InterviewsQuery } from '../types/interview.types';

export const useInterviews = (query: InterviewsQuery = {}) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(query.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await interviewService.getInterviews({ ...query, page });
      setInterviews(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Không thể tải lịch phỏng vấn');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, query.status, query.applicationId, query.startDate, query.endDate]);

  return {
    interviews,
    total,
    page,
    totalPages,
    isLoading,
    error,
    setPage,
    refetch: fetchInterviews,
  };
};

export const useUpcomingInterviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcoming = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await interviewService.getUpcomingInterviews();
      setInterviews(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Không thể tải lịch phỏng vấn');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  return { interviews, isLoading, error, refetch: fetchUpcoming };
};

export const useInterview = (id: string) => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await interviewService.getInterviewById(id);
        setInterview(data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error?.response?.data?.message || 'Không thể tải thông tin');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  return { interview, isLoading, error };
};
