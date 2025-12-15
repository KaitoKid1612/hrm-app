'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard, RecentActivity, QuickActions } from '@/components/dashboard';
import { OverviewChart, JobsChart, UserDistribution } from '@/components/charts';
import { Users, Briefcase, FileText, Building2, Download } from 'lucide-react';

// Sample data for charts
const overviewData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 1800 },
  { name: 'Mar', total: 2400 },
  { name: 'Apr', total: 1900 },
  { name: 'May', total: 2800 },
  { name: 'Jun', total: 3200 },
  { name: 'Jul', total: 3600 },
  { name: 'Aug', total: 3100 },
  { name: 'Sep', total: 4200 },
  { name: 'Oct', total: 3800 },
  { name: 'Nov', total: 4500 },
  { name: 'Dec', total: 5200 },
];

const jobsData = [
  { name: 'Jan', jobs: 65, applications: 340 },
  { name: 'Feb', jobs: 78, applications: 420 },
  { name: 'Mar', jobs: 92, applications: 580 },
  { name: 'Apr', jobs: 85, applications: 510 },
  { name: 'May', jobs: 105, applications: 690 },
  { name: 'Jun', jobs: 120, applications: 780 },
];

const userDistributionData = [
  { name: 'Candidates', value: 3245, color: 'hsl(var(--chart-1))' },
  { name: 'Employers', value: 892, color: 'hsl(var(--chart-2))' },
  { name: 'Admins', value: 43, color: 'hsl(var(--chart-3))' },
];

export default function DashboardPage() {
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
          value="4,180"
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: 20.1, isPositive: true }}
          description="from last month"
        />
        <StatCard
          title="Active Jobs"
          value="567"
          icon={Briefcase}
          iconColor="text-green-600 dark:text-green-400"
          trend={{ value: 12.5, isPositive: true }}
          description="from last month"
        />
        <StatCard
          title="Applications"
          value="3,456"
          icon={FileText}
          iconColor="text-purple-600 dark:text-purple-400"
          trend={{ value: 8.3, isPositive: true }}
          description="from last month"
        />
        <StatCard
          title="Companies"
          value="89"
          icon={Building2}
          iconColor="text-orange-600 dark:text-orange-400"
          trend={{ value: 4.5, isPositive: true }}
          description="from last month"
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
              <CardDescription>Total user registrations over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart data={overviewData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs & Applications Trend</CardTitle>
              <CardDescription>Comparing job postings vs applications received</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <JobsChart data={jobsData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of user types in the platform</CardDescription>
              </CardHeader>
              <CardContent>
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
