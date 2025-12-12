import api from '@/lib/axios';
import { CompanyAnalytics, AnalyticsQuery } from '../types/analytics.types';

const ANALYTICS_BASE = '/analytics';

export const analyticsService = {
  async getCompanyAnalytics(query?: AnalyticsQuery): Promise<CompanyAnalytics> {
    const params = new URLSearchParams();
    if (query?.timeRange) params.append('timeRange', query.timeRange);
    if (query?.startDate) params.append('startDate', query.startDate);
    if (query?.endDate) params.append('endDate', query.endDate);
    if (query?.jobId) params.append('jobId', query.jobId);

    const response = await api.get(`${ANALYTICS_BASE}/company?${params.toString()}`);
    return response.data;
  },
};
