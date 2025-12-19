'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Briefcase, FileText, Calendar, Download } from 'lucide-react';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { analyticsService } from '@/services';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  REVIEWING: '#3b82f6',
  SHORTLISTED: '#8b5cf6',
  INTERVIEWED: '#ec4899',
  OFFERED: '#10b981',
  ACCEPTED: '#059669',
  REJECTED: '#ef4444',
  WITHDRAWN: '#6b7280',
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');

  const startDate = format(subDays(new Date(), parseInt(dateRange)), 'yyyy-MM-dd');
  const endDate = format(new Date(), 'yyyy-MM-dd');

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboard-stats', startDate, endDate],
    queryFn: () => analyticsService.getDashboardStats({ startDate, endDate }),
  });

  // Fetch analytics data
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: () => analyticsService.getAnalytics({ startDate, endDate }),
  });

  if (statsLoading || analyticsLoading) {
    return <LoadingState text="Loading analytics..." />;
  }

  if (statsError || analyticsError) {
    return (
      <ErrorState error="Failed to load analytics data" retry={() => window.location.reload()} />
    );
  }

  const handleExport = () => {
    const data = {
      stats,
      analytics,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Platform insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as typeof dateRange)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.newCounts.users || 0}</span> new this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.totalCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.newCounts.companies || 0}</span> new this
              period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.totalJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.newCounts.jobs || 0}</span> new this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.newCounts.applications || 0}</span> new this
              period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Stats Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Trends</CardTitle>
          <CardDescription>New users, jobs, and applications over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.dailyStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
              <YAxis />
              <Tooltip labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" strokeWidth={2} />
              <Line type="monotone" dataKey="jobs" stroke="#10b981" name="Jobs" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#f59e0b"
                name="Applications"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Applications by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
            <CardDescription>Distribution of application statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.applicationsByStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics?.applicationsByStatus?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Distribution of user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.usersByRole || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jobs by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Top Job Categories</CardTitle>
            <CardDescription>Most popular job categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.jobsByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jobs by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Jobs by city</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.jobsByLocation || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.jobs.active || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.jobs.expired || 0} expired jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Verified Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.companies.verified || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.companies.pending || 0} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {stats?.period.startDate && format(new Date(stats.period.startDate), 'MMM dd')} -{' '}
                {stats?.period.endDate && format(new Date(stats.period.endDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
