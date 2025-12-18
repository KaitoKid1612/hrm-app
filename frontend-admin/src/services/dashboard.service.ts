import { apiClient } from '@/lib/api-client';

export interface AdminDateRange {
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

export interface AnalyticsData {
  dailyStats: Array<{
    date: string;
    users: number;
    jobs: number;
    applications: number;
    companies: number;
  }>;
  applicationsByStatus: Array<{
    status: string;
    count: number;
  }>;
  jobsByCategory: Array<{
    categoryId: string;
    count: number;
    category?: {
      name: string;
    };
  }>;
  jobsByLocation: Array<{
    city: string;
    count: number;
  }>;
}

export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats(dateRange?: AdminDateRange): Promise<DashboardOverview> {
    const response = await apiClient.get<DashboardOverview>('/admin/dashboard', {
      params: dateRange,
    });
    return response.data;
  },

  // Get analytics data
  async getAnalytics(dateRange?: AdminDateRange): Promise<AnalyticsData> {
    const response = await apiClient.get<AnalyticsData>('/admin/analytics', {
      params: dateRange,
    });
    return response.data;
  },
};
