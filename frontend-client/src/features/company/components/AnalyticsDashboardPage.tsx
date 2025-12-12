import { useState } from 'react';
import { useCompanyAnalytics } from '../hooks/useAnalytics';
import { TimeRange } from '../types/analytics.types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  CheckCircle,
  Calendar,
  Star,
  MessageSquare,
} from 'lucide-react';

const TIME_RANGE_OPTIONS = [
  { value: TimeRange.LAST_7_DAYS, label: 'Last 7 Days' },
  { value: TimeRange.LAST_30_DAYS, label: 'Last 30 Days' },
  { value: TimeRange.LAST_90_DAYS, label: 'Last 90 Days' },
  { value: TimeRange.LAST_YEAR, label: 'Last Year' },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  REVIEWING: '#3b82f6',
  INTERVIEWED: '#8b5cf6',
  ACCEPTED: '#10b981',
  REJECTED: '#ef4444',
  WITHDRAWN: '#6b7280',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  REVIEWING: 'Reviewing',
  INTERVIEWED: 'Interviewed',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div
            className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}
          >
            <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export const AnalyticsDashboardPage = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_30_DAYS);
  const { analytics, isLoading, error } = useCompanyAnalytics({ timeRange });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || 'Failed to load analytics'}</p>
        </div>
      </div>
    );
  }

  const applicationStatusData = analytics.distributions.applicationsByStatus.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || '#6b7280',
  }));

  const topJobsData = analytics.topJobs.slice(0, 5).map((job) => ({
    name: job.title.length > 30 ? job.title.substring(0, 30) + '...' : job.title,
    applications: job.applicationCount,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your recruitment performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TIME_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Company Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          {analytics.company.logo ? (
            <img
              src={analytics.company.logo}
              alt={analytics.company.name}
              className="w-16 h-16 rounded-lg bg-white object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{analytics.company.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{analytics.company.averageRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{analytics.company.totalReviews} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={analytics.overview.activeJobs}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          label="New Applications"
          value={analytics.overview.newApplications}
          color="bg-green-500"
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={analytics.overview.totalViews.toLocaleString()}
          color="bg-purple-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Conversion Rate"
          value={`${analytics.metrics.conversionRate}%`}
          color="bg-orange-500"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Jobs</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalJobs}</p>
          <p className="text-sm text-gray-600 mt-1">{analytics.overview.activeJobs} active jobs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Applications</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalApplications}</p>
          <p className="text-sm text-gray-600 mt-1">All time applications</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Avg per Job</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.metrics.avgApplicationsPerJob}
          </p>
          <p className="text-sm text-gray-600 mt-1">Applications per job</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Status Distribution
          </h3>
          {applicationStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No application data available</p>
            </div>
          )}
        </div>

        {/* Top Jobs by Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Jobs by Applications</h3>
          {topJobsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topJobsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="applications" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No job data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Jobs</h3>
        {analytics.topJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Job Title
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Applications
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.topJobs.map((job, index) => (
                  <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">#{index + 1}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      {job.applicationCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3" />
            <p>No jobs with applications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
