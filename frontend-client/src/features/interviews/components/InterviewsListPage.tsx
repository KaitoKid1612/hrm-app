import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInterviews } from '../hooks/useInterviews';
import { Interview, InterviewStatus } from '../types/interview.types';
import { Calendar, Clock, MapPin, Video, FileText, AlertCircle, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout';

export const InterviewsListPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | undefined>();
  const { interviews, total, page, totalPages, isLoading, error, setPage, refetch } = useInterviews(
    {
      limit: 20,
      status: statusFilter,
    },
  );

  const getStatusBadge = (status: InterviewStatus) => {
    const styles = {
      SCHEDULED: 'bg-blue-100 text-blue-700',
      CONFIRMED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-red-100 text-red-700',
      RESCHEDULED: 'bg-yellow-100 text-yellow-700',
      NO_SHOW: 'bg-orange-100 text-orange-700',
    };

    const labels = {
      SCHEDULED: 'Đã lên lịch',
      CONFIRMED: 'Đã xác nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
      RESCHEDULED: 'Dời lịch',
      NO_SHOW: 'Vắng mặt',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      dayOfWeek: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
    };
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch phỏng vấn...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lịch phỏng vấn</h1>
            <p className="text-gray-600">Quản lý và theo dõi các buổi phỏng vấn của bạn</p>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter((e.target.value as InterviewStatus) || undefined)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="SCHEDULED">Đã lên lịch</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="RESCHEDULED">Dời lịch</option>
                <option value="NO_SHOW">Vắng mặt</option>
              </select>
              <span className="text-sm text-gray-600">Tổng: {total} buổi phỏng vấn</span>
            </div>
          </CardContent>
        </Card>

        {/* Interviews List */}
        {error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <Button onClick={refetch} className="mt-4">
                Thử lại
              </Button>
            </CardContent>
          </Card>
        ) : interviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có lịch phỏng vấn</h3>
              <p className="text-gray-600">
                {statusFilter
                  ? 'Không có lịch phỏng vấn nào với trạng thái này'
                  : 'Bạn chưa có lịch phỏng vấn nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onStatusChange={getStatusBadge}
                  formatDateTime={formatDateTime}
                  onClick={() => navigate(`/company/interviews/${interview.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Trước
                </Button>
                <span className="px-4">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

interface InterviewCardProps {
  interview: Interview;
  onStatusChange: (status: InterviewStatus) => React.ReactNode;
  formatDateTime: (date: string) => { date: string; time: string; dayOfWeek: string };
  onClick: () => void;
}

const InterviewCard = ({
  interview,
  onStatusChange,
  formatDateTime,
  onClick,
}: InterviewCardProps) => {
  const { date, time, dayOfWeek } = formatDateTime(interview.scheduledAt);

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Date Badge */}
          <div className="w-20 h-20 bg-blue-50 rounded-lg flex flex-col items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-blue-600">{date.split('/')[0]}</span>
            <span className="text-xs text-gray-600">{date.split('/')[1]}</span>
          </div>

          {/* Interview Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {interview.application?.job?.title || 'N/A'}
                </h3>
                <p className="text-gray-600">
                  Ứng viên: {interview.application?.user?.name || 'N/A'}
                </p>
              </div>
              {onStatusChange(interview.status)}
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {dayOfWeek}, {date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {time} ({interview.duration} phút)
                </span>
              </div>
              {interview.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{interview.location}</span>
                </div>
              )}
              {interview.meetingLink && (
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="truncate text-blue-600">Online meeting</span>
                </div>
              )}
            </div>

            {interview.notes && (
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <FileText className="w-4 h-4 mt-0.5" />
                <p className="line-clamp-2">{interview.notes}</p>
              </div>
            )}
          </div>

          {/* Action Indicator */}
          <div className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
