import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { CompanyAnalytics, AnalyticsQuery } from '../types/analytics.types';

export const useCompanyAnalytics = (query?: AnalyticsQuery) => {
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getCompanyAnalytics(query);
      setAnalytics(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, isLoading, error, refetch: fetchAnalytics };
};
