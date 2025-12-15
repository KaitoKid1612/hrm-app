import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Building2,
  Calendar,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
} from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';
import { useJobApplication } from '../hooks/useJobApplication';
import { useSavedJob } from '../hooks/useSavedJob';
import { useJobDetail } from '../hooks/useJobs';

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const { job, isLoading, error } = useJobDetail(id || '');
  const { hasApplied, applyJob } = useJobApplication(id || '');
  const { isSaved, toggleSave } = useSavedJob(id || '');

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?returnUrl=${ROUTES.JOB_DETAIL.replace(':id', id || '')}`);
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const handleApplySubmit = async (data: { resumeId?: string; coverLetter?: string }) => {
    await applyJob(data);
    alert('Nộp đơn thành công! Bạn có thể xem trạng thái tại "Đơn ứng tuyển của tôi"');
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?returnUrl=${ROUTES.JOB_DETAIL.replace(':id', id || '')}`);
      return;
    }

    try {
      await toggleSave();
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: job.title,
          text: `${job.title} tại ${job.company.name}`,
          url: url,
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(url);
      setShareMessage('Đã sao chép link!');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} VNĐ`;
  };

  const getJobTypeLabel = (type: string) => {
    const labels = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      CONTRACT: 'Hợp đồng',
      INTERNSHIP: 'Thực tập',
      FREELANCE: 'Freelance',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getJobLevelLabel = (level: string) => {
    const labels = {
      INTERN: 'Thực tập sinh',
      FRESHER: 'Fresher',
      JUNIOR: 'Junior',
      MIDDLE: 'Middle',
      SENIOR: 'Senior',
      LEADER: 'Leader',
      MANAGER: 'Manager',
      ENTRY_LEVEL: 'Nhập môn',
      EXPERIENCED: 'Có kinh nghiệm',
      NOT_REQUIRED: 'Không yêu cầu',
    };
    return labels[level as keyof typeof labels] || level;
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin việc làm...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Không thể tải thông tin việc làm</p>
            <Button onClick={() => navigate(ROUTES.JOBS)}>Quay lại danh sách</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check if job is new
  const isJobNew = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(job.createdAt) > sevenDaysAgo;
  };

  // Check if job is hot
  const isJobHot = () => {
    return job._count.applications > 10 || job.salaryMax > 20000000;
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
                      {job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Briefcase className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                          <Link
                            to={`/companies/${job.company.id}`}
                            className="text-lg text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {job.company.name}
                          </Link>
                        </div>
                        <div className="flex gap-2">
                          {isJobHot() && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                              <TrendingUp className="w-4 h-4" />
                              Hot
                            </span>
                          )}
                          {isJobNew() && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                              ✨ Mới
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Mức lương</p>
                        <p className="font-semibold text-green-600 text-sm">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Địa điểm</p>
                        <p className="font-semibold text-sm">{job.city || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Hình thức</p>
                        <p className="font-semibold text-sm">{getJobTypeLabel(job.jobType)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-500">Số lượng</p>
                        <p className="font-semibold text-sm">{job.positions} vị trí</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApply}
                      size="lg"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg"
                      disabled={hasApplied}
                    >
                      {hasApplied
                        ? 'Đã ứng tuyển'
                        : isAuthenticated
                          ? 'Ứng tuyển ngay'
                          : 'Đăng nhập để ứng tuyển'}
                    </Button>
                    <Button onClick={handleSave} size="lg" variant="outline" className="px-6">
                      {isSaved ? (
                        <BookmarkCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      onClick={handleShare}
                      size="lg"
                      variant="outline"
                      className="px-6 relative"
                    >
                      <Share2 className="w-5 h-5" />
                      {shareMessage && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                          {shareMessage}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Yêu cầu ứng viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </CardContent>
              </Card>

              {/* Benefits */}
              {job.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quyền lợi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Kỹ năng yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((jobSkill) => (
                        <span
                          key={jobSkill.id}
                          className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
                        >
                          {jobSkill.skill.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Thông tin công ty
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      {job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Building2 className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.company.name}</h3>
                      {job.company.city && (
                        <p className="text-sm text-gray-600">{job.company.city}</p>
                      )}
                    </div>
                  </div>
                  {job.address && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-gray-600">{job.address}</span>
                      </div>
                    </div>
                  )}
                  <Link to={`/companies/${job.company.id}`}>
                    <Button variant="outline" className="w-full">
                      Xem trang công ty
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Job Meta */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {job.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Hạn nộp:{' '}
                        <strong>{new Date(job.deadline).toLocaleDateString('vi-VN')}</strong>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Ngày đăng:{' '}
                      <strong>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Cấp bậc: <strong>{getJobLevelLabel(job.jobLevel)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Lượt xem: <strong>{job.viewCount}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Ứng viên: <strong>{job._count.applications}</strong>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        onSubmit={handleApplySubmit}
      />
    </MainLayout>
  );
};

export default JobDetailPage;
