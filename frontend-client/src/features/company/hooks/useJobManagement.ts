import { useState, useEffect } from 'react';
import { jobManagementService, Job } from '../services/jobManagementService';

export const useJobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobManagementService.getMyJobs(params);
      setJobs(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobs,
    isLoading,
    error,
    loadJobs,
    setJobs,
  };
};

export const useJobDetail = (id?: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);

  const loadJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobManagementService.getJobById(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    job,
    isLoading,
    error,
    reload: () => id && loadJob(id),
    setJob,
  };
};
