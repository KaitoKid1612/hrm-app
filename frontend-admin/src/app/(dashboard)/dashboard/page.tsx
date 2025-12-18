'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard, RecentActivity, QuickActions } from '@/components/dashboard';
import { OverviewChart, UserDistribution } from '@/components/charts';
import { Users, Briefcase, FileText, Building2, Download } from 'lucide-react';
import { dashboardService } from '@/services';
import { LoadingState, ErrorState } from '@/components/shared/states';

export default function DashboardPage() {
  // Fetch dashboard stats
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => dashboardService.getAnalytics(),
  });

  if (isLoading) return <LoadingState text="Loading dashboard..." />;
  if (error) return <ErrorState error={error as Error} />;

  const overview = stats?.overview;
  const newCounts = stats?.newCounts;
  const usersByRole = stats?.usersByRole || [];

  // Calculate growth percentages
  const usersGrowth = overview?.totalUsers
    ? (((newCounts?.users || 0) / overview.totalUsers) * 100).toFixed(1)
    : 0;
  const companiesGrowth = overview?.totalCompanies
    ? (((newCounts?.companies || 0) / overview.totalCompanies) * 100).toFixed(1)
    : 0;
  const jobsGrowth = overview?.totalJobs
    ? (((newCounts?.jobs || 0) / overview.totalJobs) * 100).toFixed(1)
    : 0;
  const applicationsGrowth = overview?.totalApplications
    ? (((newCounts?.applications || 0) / overview.totalApplications) * 100).toFixed(1)
    : 0;

  // Prepare user distribution data for pie chart
  const userDistributionData = usersByRole.map((item, index) => ({
    name: item.role,
    value: item.count,
    color: `hsl(var(--chart-${index + 1}))`,
  }));

  // Prepare overview data for line chart
  const overviewData =
    analytics?.dailyStats?.map(
      (stat: {
        date: string;
        users: number;
        jobs: number;
        applications: number;
        companies: number;
      }) => ({
        name: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: stat.users + stat.jobs + stat.applications + stat.companies,
        users: stat.users,
        jobs: stat.jobs,
        applications: stat.applications,
      }),
    ) || [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={overview?.totalUsers?.toLocaleString() || '0'}
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: Number(usersGrowth), isPositive: Number(usersGrowth) > 0 }}
          description={`+${newCounts?.users || 0} this period`}
        />
        <StatCard
          title="Active Jobs"
          value={stats?.jobs?.active?.toLocaleString() || '0'}
          icon={Briefcase}
          iconColor="text-green-600 dark:text-green-400"
          trend={{ value: Number(jobsGrowth), isPositive: Number(jobsGrowth) > 0 }}
          description={`+${newCounts?.jobs || 0} this period`}
        />
        <StatCard
          title="Applications"
          value={overview?.totalApplications?.toLocaleString() || '0'}
          icon={FileText}
          iconColor="text-purple-600 dark:text-purple-400"
          trend={{ value: Number(applicationsGrowth), isPositive: Number(applicationsGrowth) > 0 }}
          description={`+${newCounts?.applications || 0} this period`}
        />
        <StatCard
          title="Companies"
          value={stats?.companies?.verified?.toLocaleString() || '0'}
          icon={Building2}
          iconColor="text-orange-600 dark:text-orange-400"
          trend={{ value: Number(companiesGrowth), isPositive: Number(companiesGrowth) > 0 }}
          description={`${stats?.companies?.pending || 0} pending`}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs & Applications</TabsTrigger>
          <TabsTrigger value="users">User Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>Activity over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {overviewData.length > 0 ? (
                <OverviewChart data={overviewData} />
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs & Applications Overview</CardTitle>
              <CardDescription>Current job statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold">{stats?.jobs?.active || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Expired Jobs</p>
                  <p className="text-3xl font-bold">{stats?.jobs?.expired || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold">{overview?.totalApplications || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by user role</CardDescription>
              </CardHeader>
              <CardContent>
                {userDistributionData.length > 0 ? (
                  <>
                    <UserDistribution data={userDistributionData} />
                    <div className="mt-4 space-y-2">
                      {userDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </CardContent>
            </Card>
            <QuickActions />
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="grid gap-4">
        <RecentActivity />
      </div>
    </div>
  );
}
