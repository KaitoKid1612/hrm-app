import { useState, useEffect } from 'react';
import { jobService, JobsResponse } from '../services/jobService';
import { JobSearchParams, Job } from '../types';

export const useJobs = (params?: JobSearchParams) => {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await jobService.getJobs(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(params)]);

  return {
    jobs: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    refetch: fetchJobs,
  };
};

export const useJobStatistics = () => {
  const [stats, setStats] = useState<{
    totalJobs: number;
    totalCompanies: number;
    totalCandidates: number;
    totalApplications: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await jobService.getJobStatistics();
        setStats(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};

export const useTrendingJobs = (limit: number = 6) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrendingJobs = async () => {
      try {
        setIsLoading(true);
        const result = await jobService.getTrendingJobs(limit);
        setJobs(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch trending jobs'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingJobs();
  }, [limit]);

  return { jobs, isLoading, error };
};

export const useJobDetail = (id: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchJobDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await jobService.getJobById(id);
        setJob(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch job detail'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  return { job, isLoading, error };
};
