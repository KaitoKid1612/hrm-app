import api from '@/lib/axios';

export enum TimeRange {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_3_MONTHS = 'last_3_months',
  LAST_6_MONTHS = 'last_6_months',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom',
}

export interface CandidateAnalyticsQuery {
  timeRange?: TimeRange;
  startDate?: string;
  endDate?: string;
}

export interface CandidateAnalytics {
  overview: {
    totalApplications: number;
    newApplications: number;
    savedJobsCount: number;
    profileIsPublic: boolean;
  };
  metrics: {
    successRate: string;
    responseRate: string;
    acceptedCount: number;
    rejectedCount: number;
    pendingCount: number;
  };
  distributions: {
    applicationsByStatus: Array<{
      status: string;
      count: number;
    }>;
  };
  recentApplications: Array<{
    id: string;
    status: string;
    appliedAt: string;
    job: {
      id: string;
      title: string;
      company: {
        id: string;
        name: string;
        logo?: string;
      };
    };
  }>;
  timeRange: {
    start: string;
    end: string;
  };
}

const ANALYTICS_BASE = '/analytics';

export const candidateAnalyticsService = {
  async getCandidateAnalytics(query?: CandidateAnalyticsQuery): Promise<CandidateAnalytics> {
    const params = new URLSearchParams();
    if (query?.timeRange) params.append('timeRange', query.timeRange);
    if (query?.startDate) params.append('startDate', query.startDate);
    if (query?.endDate) params.append('endDate', query.endDate);

    const response = await api.get(`${ANALYTICS_BASE}/candidate?${params.toString()}`);
    return response.data;
  },
};
