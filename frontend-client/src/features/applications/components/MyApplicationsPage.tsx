import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { applicationService } from '@/features/jobs/services/jobActionsService';
import {
  FileText,
  Calendar,
  MapPin,
  Briefcase,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  jobId: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
  job?: {
    title?: string;
    location?: string;
    type?: string;
    company?: {
      name?: string;
      logo?: string;
    };
  };
}

const statusConfig = {
  PENDING: {
    label: 'Đang chờ',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  REVIEWING: {
    label: 'Đang xem xét',
    icon: AlertCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  SHORTLISTED: {
    label: 'Lọt vòng',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  INTERVIEWED: {
    label: 'Đã phỏng vấn',
    icon: CheckCircle2,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  ACCEPTED: {
    label: 'Chấp nhận',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  REJECTED: {
    label: 'Từ chối',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  WITHDRAWN: {
    label: 'Đã rút',
    icon: XCircle,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  },
};

export const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  const getStatusCount = (status: string) => {
    return applications.filter((app) => app.status === status).length;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Đơn ứng tuyển của tôi
            </h1>
            <p className="text-gray-600 mt-1">Quản lý các đơn ứng tuyển của bạn</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({applications.length})
            </button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = getStatusCount(status);
              if (count === 0) return null;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    statusFilter === status
                      ? `${config.bg} ${config.color} ${config.border} border`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const status = statusConfig[application.status as keyof typeof statusConfig];
              const StatusIcon = status?.icon || AlertCircle;

              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-4">
                          {/* Company Logo */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
                            {application.job?.company?.logo ? (
                              <img
                                src={application.job.company.logo}
                                alt={application.job.company.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Briefcase className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {application.job?.title || 'N/A'}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {application.job?.company?.name || 'N/A'}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {application.job?.location || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {application.job?.type || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Nộp: {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cover Letter Preview */}
                        {application.coverLetter && (
                          <div className="pl-20">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              <span className="font-medium">Thư giới thiệu:</span>{' '}
                              {application.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${status?.bg || 'bg-gray-50'} ${status?.border || 'border-gray-200'} border`}
                        >
                          <StatusIcon className={`w-4 h-4 ${status?.color || 'text-gray-600'}`} />
                          <span className={`font-medium ${status?.color || 'text-gray-600'}`}>
                            {status?.label || application.status}
                          </span>
                        </div>

                        <Button
                          onClick={() => navigate(`/jobs/${application.jobId}`)}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Xem tin
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {statusFilter ? 'Không có đơn ứng tuyển nào' : 'Bạn chưa nộp đơn ứng tuyển nào'}
              </h3>
              <p className="text-gray-600 mb-4">
                {statusFilter
                  ? 'Không tìm thấy đơn ứng tuyển với trạng thái này'
                  : 'Khám phá các việc làm phù hợp và bắt đầu ứng tuyển ngay'}
              </p>
              <Button onClick={() => navigate('/jobs')}>Tìm việc làm</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplicationsPage;
