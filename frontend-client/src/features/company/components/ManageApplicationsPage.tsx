import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApplicationManagement } from '../hooks/useApplicationManagement';
import { applicationManagementService } from '../services/applicationManagementService';
import { ROUTES } from '@/constants';
import {
  FileText,
  Search,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  User,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

const statusConfig = {
  PENDING: {
    label: 'Đang chờ',
    icon: Clock,
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
  },
  REVIEWING: {
    label: 'Đang xem xét',
    icon: AlertCircle,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
  },
  SHORTLISTED: {
    label: 'Lọt vòng',
    icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
  },
  INTERVIEWED: {
    label: 'Đã phỏng vấn',
    icon: CheckCircle2,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
  },
  ACCEPTED: {
    label: 'Chấp nhận',
    icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
  },
  REJECTED: {
    label: 'Từ chối',
    icon: XCircle,
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
  },
  WITHDRAWN: {
    label: 'Đã rút',
    icon: XCircle,
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
  },
};

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Đang chờ' },
  { value: 'REVIEWING', label: 'Đang xem xét' },
  { value: 'SHORTLISTED', label: 'Lọt vòng' },
  { value: 'INTERVIEWED', label: 'Đã phỏng vấn' },
  { value: 'ACCEPTED', label: 'Chấp nhận' },
  { value: 'REJECTED', label: 'Từ chối' },
];

export const ManageApplicationsPage = () => {
  const navigate = useNavigate();
  const { applications, isLoading, loadApplications } = useApplicationManagement();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadApplications({ status: statusFilter || undefined });
  }, [statusFilter]);

  const filteredApplications = applications.filter(
    (app) =>
      app.candidate?.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.candidate?.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.job?.title.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await applicationManagementService.updateApplicationStatus(
        id,
        newStatus as ApplicationDetail['status'],
      );
      loadApplications({ status: statusFilter || undefined });
    } catch {
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusCount = (status: string) => {
    return applications.filter((app) => app.status === status).length;
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Quản lý đơn ứng tuyển
          </h1>
          <p className="text-gray-600 mt-1">Tổng cộng {applications.length} đơn ứng tuyển</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên ứng viên, email, vị trí..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.value && ` (${getStatusCount(option.value)})`}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const status = statusConfig[application.status];
            const StatusIcon = status?.icon || Clock;

            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shrink-0">
                          {application.candidate?.avatar ? (
                            <img
                              src={application.candidate.avatar}
                              alt={application.candidate.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <User className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.candidate?.fullName || 'N/A'}
                          </h3>

                          <div className="space-y-1 mt-2 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {application.candidate?.email || 'N/A'}
                            </p>
                            {application.candidate?.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {application.candidate.phone}
                              </p>
                            )}
                            <p className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Ứng tuyển:{' '}
                              <span className="font-medium">{application.job?.title || 'N/A'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Nộp đơn: {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>

                          {/* Cover Letter Preview */}
                          {application.coverLetter && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                <span className="font-medium">Thư giới thiệu:</span>{' '}
                                {application.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status?.bg || 'bg-gray-100'} ${status?.color || 'text-gray-700'}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {status?.label || application.status}
                      </span>

                      {/* Status Change Dropdown */}
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        ))}
                      </select>

                      {/* View Detail Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`${ROUTES.MANAGE_APPLICATIONS}/${application.id}`)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
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
              {searchKeyword || statusFilter
                ? 'Không tìm thấy đơn ứng tuyển'
                : 'Chưa có đơn ứng tuyển nào'}
            </h3>
            <p className="text-gray-600">
              {searchKeyword || statusFilter
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Các đơn ứng tuyển sẽ xuất hiện ở đây khi có ứng viên nộp đơn'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageApplicationsPage;

// Type import for status change
import type { ApplicationDetail } from '../services/applicationManagementService';
