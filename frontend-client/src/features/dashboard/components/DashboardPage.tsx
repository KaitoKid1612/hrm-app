import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { StatCard } from './StatCard';
import {
  FileText,
  Bookmark,
  CheckCircle,
  Clock,
  Briefcase,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // TODO: Replace with real data from API
  const stats = {
    totalApplications: 12,
    savedJobs: 8,
    acceptedApplications: 3,
    pendingApplications: 5,
  };

  const recentApplications = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'FPT Software',
      status: 'REVIEWING',
      appliedAt: '2025-12-10',
    },
    {
      id: '2',
      jobTitle: 'Backend Developer',
      company: 'VNG Corporation',
      status: 'PENDING',
      appliedAt: '2025-12-09',
    },
    {
      id: '3',
      jobTitle: 'Full-stack Developer',
      company: 'Teko Vietnam',
      status: 'INTERVIEWED',
      appliedAt: '2025-12-08',
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    REVIEWING: 'text-blue-600 bg-blue-50',
    INTERVIEWED: 'text-purple-600 bg-purple-50',
    ACCEPTED: 'text-green-600 bg-green-50',
    REJECTED: 'text-red-600 bg-red-50',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    REVIEWING: 'Đang xem xét',
    INTERVIEWED: 'Đã phỏng vấn',
    ACCEPTED: 'Đã chấp nhận',
    REJECTED: 'Đã từ chối',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">Theo dõi hoạt động tìm việc của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Đã ứng tuyển"
          value={stats.totalApplications}
          icon={FileText}
          color="blue"
        />
        <StatCard title="Việc đã lưu" value={stats.savedJobs} icon={Bookmark} color="purple" />
        <StatCard
          title="Được chấp nhận"
          value={stats.acceptedApplications}
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="Đang chờ" value={stats.pendingApplications} icon={Clock} color="orange" />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Tìm việc làm phù hợp</h3>
            <p className="text-blue-100 mb-4">Khám phá hàng ngàn cơ hội việc làm đang chờ bạn</p>
            <Button
              onClick={() => navigate(ROUTES.JOBS)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Tìm việc ngay
            </Button>
          </div>
          <TrendingUp className="w-24 h-24 text-blue-400 opacity-20" />
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Ứng tuyển gần đây</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.MY_APPLICATIONS)}
            className="text-blue-600 hover:text-blue-700"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {recentApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => navigate(`${ROUTES.MY_APPLICATIONS}`)}
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{app.jobTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">{app.company}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}
                >
                  {statusLabels[app.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {recentApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Bạn chưa ứng tuyển vào công việc nào</p>
            <Button
              onClick={() => navigate(ROUTES.JOBS)}
              variant="link"
              className="text-blue-600 mt-2"
            >
              Tìm việc ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export { Dashboard as default };
export { Dashboard as DashboardPage };
