export enum TimeRange {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

export interface CompanyAnalytics {
  company: {
    id: string;
    name: string;
    logo?: string;
    averageRating: number;
    totalReviews: number;
  };
  overview: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    totalViews: number;
  };
  metrics: {
    conversionRate: string;
    avgApplicationsPerJob: string;
  };
  distributions: {
    applicationsByStatus: Array<{
      status: string;
      count: number;
    }>;
  };
  topJobs: Array<{
    id: string;
    title: string;
    applicationCount: number;
  }>;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface AnalyticsQuery {
  timeRange?: TimeRange;
  startDate?: string;
  endDate?: string;
  jobId?: string;
}
