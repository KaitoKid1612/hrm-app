import { useState, useEffect } from 'react';
import {
  applicationManagementService,
  ApplicationDetail,
} from '../services/applicationManagementService';

export const useApplicationManagement = (jobId?: string) => {
  const [applications, setApplications] = useState<ApplicationDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async (params?: { status?: string; page?: number; limit?: number }) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await applicationManagementService.getApplications({
        ...params,
        jobId,
      });
      setApplications(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    loadApplications,
    setApplications,
  };
};

export const useApplicationDetail = (id?: string) => {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadApplication(id);
    }
  }, [id]);

  const loadApplication = async (appId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await applicationManagementService.getApplicationById(appId);
      setApplication(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: ApplicationDetail['status']) => {
    if (!id) return;

    const updated = await applicationManagementService.updateApplicationStatus(id, status);
    setApplication(updated);
    return updated;
  };

  return {
    application,
    isLoading,
    error,
    updateStatus,
    reload: () => id && loadApplication(id),
  };
};
