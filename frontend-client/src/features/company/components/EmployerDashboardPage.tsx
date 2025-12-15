import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
} from 'lucide-react';
import { ROUTES } from '@/constants';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  totalCandidates: number;
  interviewScheduled: number;
}

interface RecentApplication {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
}

export const EmployerDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    totalCandidates: 0,
    interviewScheduled: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch from API
      // Mock data for now
      setStats({
        totalJobs: 12,
        activeJobs: 8,
        totalApplications: 145,
        newApplications: 23,
        totalCandidates: 89,
        interviewScheduled: 5,
      });

      setRecentApplications([
        {
          id: '1',
          candidateName: 'Nguyễn Văn A',
          candidateEmail: 'nguyenvana@email.com',
          jobTitle: 'Senior Frontend Developer',
          status: 'PENDING',
          appliedAt: '2025-12-12T10:30:00',
        },
        {
          id: '2',
          candidateName: 'Trần Thị B',
          candidateEmail: 'tranthib@email.com',
          jobTitle: 'Backend Developer',
          status: 'REVIEWING',
          appliedAt: '2025-12-12T09:15:00',
        },
        {
          id: '3',
          candidateName: 'Lê Văn C',
          candidateEmail: 'levanc@email.com',
          jobTitle: 'Full Stack Developer',
          status: 'SHORTLISTED',
          appliedAt: '2025-12-11T16:45:00',
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng tin tuyển dụng',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      subtitle: `${stats.activeJobs} đang mở`,
    },
    {
      title: 'Đơn ứng tuyển',
      value: stats.totalApplications,
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50',
      subtitle: `${stats.newApplications} mới`,
    },
    {
      title: 'Ứng viên',
      value: stats.totalCandidates,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      subtitle: 'Tổng số ứng viên',
    },
    {
      title: 'Phỏng vấn',
      value: stats.interviewScheduled,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      subtitle: 'Đã lên lịch',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; icon: typeof Clock; color: string; bg: string }
    > = {
      PENDING: {
        label: 'Đang chờ',
        icon: Clock,
        color: 'text-yellow-700',
        bg: 'bg-yellow-100',
      },
      REVIEWING: {
        label: 'Đang xem xét',
        icon: Eye,
        color: 'text-blue-700',
        bg: 'bg-blue-100',
      },
      SHORTLISTED: {
        label: 'Lọt vòng',
        icon: CheckCircle2,
        color: 'text-green-700',
        bg: 'bg-green-100',
      },
      REJECTED: {
        label: 'Từ chối',
        icon: XCircle,
        color: 'text-red-700',
        bg: 'bg-red-100',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hoạt động tuyển dụng</p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.POST_JOB)}
          className="gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Đăng tin tuyển dụng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đơn ứng tuyển mới nhất</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.MANAGE_APPLICATIONS)}>
            Xem tất cả
          </Button>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`${ROUTES.MANAGE_APPLICATIONS}/${app.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{app.candidateName}</h4>
                      <p className="text-sm text-gray-600">{app.candidateEmail}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ứng tuyển: <span className="font-medium">{app.jobTitle}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(app.appliedAt).toLocaleString('vi-VN')}
                      </p>
                      <div className="mt-2">{getStatusBadge(app.status)}</div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Chưa có đơn ứng tuyển nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(ROUTES.MANAGE_JOBS)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quản lý tin tuyển dụng</h3>
                <p className="text-sm text-gray-600">Xem và chỉnh sửa tin đăng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(ROUTES.CANDIDATES)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tìm ứng viên</h3>
                <p className="text-sm text-gray-100">Tìm kiếm ứng viên phù hợp</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(ROUTES.COMPANY_PROFILE)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hồ sơ công ty</h3>
                <p className="text-sm text-gray-600">Cập nhật thông tin công ty</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
