import { apiClient } from '@/lib/api-client';

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface DashboardOverview {
  overview: {
    totalUsers: number;
    totalCompanies: number;
    totalJobs: number;
    totalApplications: number;
  };
  newCounts: {
    users: number;
    companies: number;
    jobs: number;
    applications: number;
  };
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  jobs: {
    active: number;
    expired: number;
  };
  companies: {
    verified: number;
    pending: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface DailyStats {
  date: string;
  users: number;
  companies: number;
  jobs: number;
  applications: number;
}

export interface GrowthData {
  month: string;
  users: number;
  companies: number;
  jobs: number;
  applications: number;
}

export interface AnalyticsData {
  period: {
    startDate: string;
    endDate: string;
  };
  dailyStats: DailyStats[];
  applicationsByStatus: Array<{
    status: string;
    count: number;
  }>;
  jobsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  jobsByLocation: Array<{
    city: string;
    count: number;
  }>;
}

export const analyticsService = {
  // Get dashboard stats
  async getDashboardStats(params?: DateRangeParams): Promise<DashboardOverview> {
    const response = await apiClient.get<DashboardOverview>('/admin/dashboard', { params });
    return response.data;
  },

  // Get analytics data
  async getAnalytics(params?: DateRangeParams): Promise<AnalyticsData> {
    const response = await apiClient.get<AnalyticsData>('/admin/analytics', { params });
    return response.data;
  },

  // Get platform growth data
  async getPlatformGrowth(months: number = 12): Promise<GrowthData[]> {
    const response = await apiClient.get<GrowthData[]>('/analytics/platform/growth', {
      params: { months },
    });
    return response.data;
  },

  // Get top companies by jobs
  async getTopCompanies(limit: number = 10): Promise<Array<{ name: string; jobCount: number }>> {
    const response = await apiClient.get('/analytics/companies/top', {
      params: { limit },
    });
    return response.data;
  },

  // Get top categories by jobs
  async getTopCategories(limit: number = 10): Promise<Array<{ name: string; jobCount: number }>> {
    const response = await apiClient.get('/analytics/categories/top', {
      params: { limit },
    });
    return response.data;
  },
};
