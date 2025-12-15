import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJobManagement } from '../hooks/useJobManagement';
import { jobManagementService } from '../services/jobManagementService';
import { ROUTES } from '@/constants';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  XCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';

const statusConfig = {
  DRAFT: { label: 'Bản nháp', icon: Clock, color: 'text-gray-700', bg: 'bg-gray-100' },
  ACTIVE: { label: 'Đang mở', icon: CheckCircle2, color: 'text-green-700', bg: 'bg-green-100' },
  CLOSED: { label: 'Đã đóng', icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
  EXPIRED: { label: 'Hết hạn', icon: XCircle, color: 'text-orange-700', bg: 'bg-orange-100' },
};

export const ManageJobsPage = () => {
  const navigate = useNavigate();
  const { jobs, isLoading, loadJobs } = useJobManagement();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadJobs({ status: statusFilter });
  }, [statusFilter]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;

    try {
      await jobManagementService.deleteJob(id);
      loadJobs({ status: statusFilter });
    } catch {
      alert('Có lỗi xảy ra khi xóa tin tuyển dụng');
    }
  };

  const handleClose = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn đóng tin tuyển dụng này?')) return;

    try {
      await jobManagementService.closeJob(id);
      loadJobs({ status: statusFilter });
    } catch {
      alert('Có lỗi xảy ra khi đóng tin tuyển dụng');
    }
  };

  const handleReopen = async (id: string) => {
    try {
      await jobManagementService.reopenJob(id);
      loadJobs({ status: statusFilter });
    } catch {
      alert('Có lỗi xảy ra khi mở lại tin tuyển dụng');
    }
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
            <Briefcase className="w-6 h-6 text-blue-600" />
            Quản lý tin tuyển dụng
          </h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả tin tuyển dụng của bạn</p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.POST_JOB)}
          className="gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Đăng tin mới
        </Button>
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
                placeholder="Tìm kiếm theo tiêu đề..."
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
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const status = statusConfig[job.status];
            const StatusIcon = status?.icon || Clock;

            return (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            {job.isHot && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <TrendingUp className="w-3 h-3" />
                                Hot
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {(job.salary.min / 1000000).toFixed(0)} -{' '}
                              {(job.salary.max / 1000000).toFixed(0)} triệu
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.numberOfPositions} vị trí
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Hạn: {new Date(job.expiresAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Eye className="w-4 h-4" />
                              {job.views || 0} lượt xem
                            </span>
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                              {job.applications || 0} đơn ứng tuyển
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status?.bg || 'bg-gray-100'} ${status?.color || 'text-gray-700'}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {status?.label || job.status}
                      </span>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`${ROUTES.JOB_DETAIL.replace(':id', job.id)}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>

                        {job.status === 'ACTIVE' && (
                          <Button size="sm" variant="outline" onClick={() => handleClose(job.id)}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Đóng
                          </Button>
                        )}

                        {job.status === 'CLOSED' && (
                          <Button size="sm" variant="outline" onClick={() => handleReopen(job.id)}>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Mở lại
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`${ROUTES.MANAGE_JOBS}/${job.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchKeyword || statusFilter
                ? 'Không tìm thấy tin tuyển dụng'
                : 'Chưa có tin tuyển dụng nào'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchKeyword || statusFilter
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bắt đầu đăng tin tuyển dụng để tìm ứng viên phù hợp'}
            </p>
            <Button
              onClick={() => navigate(ROUTES.POST_JOB)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Đăng tin tuyển dụng
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageJobsPage;
