import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  users: {
    total: number;
    candidates: number;
    employers: number;
    admins: number;
    growth: number;
  };
  companies: {
    total: number;
    verified: number;
    pending: number;
    growth: number;
  };
  jobs: {
    total: number;
    active: number;
    closed: number;
    growth: number;
  };
  applications: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    growth: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
}

export interface GrowthData {
  month: string;
  users: number;
  jobs: number;
  applications: number;
}

export const analyticsService = {
  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard');
    return response.data;
  },

  // Get analytics data
  async getAnalytics(params?: { startDate?: string; endDate?: string }): Promise<unknown> {
    const response = await apiClient.get('/admin/analytics', { params });
    return response.data;
  },

  // Get user growth data
  async getUserGrowth(period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData[]> {
    const response = await apiClient.get<ChartData[]>('/analytics/users/growth', {
      params: { period },
    });
    return response.data;
  },

  // Get job statistics
  async getJobStats(period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData[]> {
    const response = await apiClient.get<ChartData[]>('/analytics/jobs/stats', {
      params: { period },
    });
    return response.data;
  },

  // Get application statistics
  async getApplicationStats(period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData[]> {
    const response = await apiClient.get<ChartData[]>('/analytics/applications/stats', {
      params: { period },
    });
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
